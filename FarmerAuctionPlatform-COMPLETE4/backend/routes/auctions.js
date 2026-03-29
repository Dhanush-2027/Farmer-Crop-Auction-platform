const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dataManager = require('../utils/dataManager');
const { authenticateToken, isFarmer } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'crop-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all active auctions (public route)
router.get('/', (req, res) => {
  try {
    const { crop, state, minPrice, maxPrice, sortBy = 'endTime', status = 'active' } = req.query;

    // Get auctions with enhanced business logic
    let auctions = dataManager.getAuctionsWithBidInfo();

    // Filter by status (default to active only)
    if (status !== 'all') {
      auctions = auctions.filter(auction => auction.status === status);
    }

    // Apply filters
    if (crop) {
      auctions = auctions.filter(auction =>
        auction.cropName.toLowerCase().includes(crop.toLowerCase())
      );
    }

    if (state) {
      auctions = auctions.filter(auction =>
        auction.state.toLowerCase().includes(state.toLowerCase())
      );
    }

    if (minPrice) {
      auctions = auctions.filter(auction => auction.currentHighestBid >= parseInt(minPrice));
    }

    if (maxPrice) {
      auctions = auctions.filter(auction => auction.currentHighestBid <= parseInt(maxPrice));
    }

    // Sort auctions with logical business rules
    if (sortBy === 'endTime') {
      // Ending soon first, but prioritize active auctions
      auctions.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (b.status === 'active' && a.status !== 'active') return 1;
        return new Date(a.endTime) - new Date(b.endTime);
      });
    } else if (sortBy === 'price') {
      auctions.sort((a, b) => a.currentHighestBid - b.currentHighestBid);
    } else if (sortBy === 'latest') {
      auctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      auctions.sort((a, b) => b.bidCount - a.bidCount);
    }

    res.json(auctions);
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific auction details
router.get('/:auctionId', (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = dataManager.findById('auctions.json', auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Get enhanced auction info with business logic
    const auctionWithInfo = dataManager.getAuctionWithBidInfo(auction);

    // Get all bids for this auction with buyer details
    const allBids = dataManager.getAll('bids.json');
    const allBuyers = dataManager.getAll('buyers.json');

    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId);

    const bidsWithBuyerInfo = auctionBids.map(bid => {
      const buyer = allBuyers.find(b => b.id === bid.buyerId);
      return {
        ...bid,
        buyerName: buyer ? buyer.name : 'Anonymous',
        buyerLocation: buyer ? `${buyer.city}, ${buyer.state}` : 'Unknown',
        isWinning: bid.amount === auctionWithInfo.currentHighestBid
      };
    }).sort((a, b) => b.amount - a.amount);

    // Calculate bid statistics
    const bidStats = {
      totalBids: bidsWithBuyerInfo.length,
      uniqueBidders: new Set(bidsWithBuyerInfo.map(bid => bid.buyerId)).size,
      averageBid: bidsWithBuyerInfo.length > 0
        ? Math.round(bidsWithBuyerInfo.reduce((sum, bid) => sum + bid.amount, 0) / bidsWithBuyerInfo.length)
        : 0,
      priceIncrease: auctionWithInfo.currentHighestBid - auction.minimumBid
    };

    // Get minimum next bid using business logic
    const nextBidInfo = dataManager.validateBid(auctionId, 'dummy', auctionWithInfo.currentHighestBid + 1);

    res.json({
      ...auctionWithInfo,
      bids: bidsWithBuyerInfo,
      bidStats,
      minimumNextBid: nextBidInfo.valid ? nextBidInfo.minimumNextBid : auctionWithInfo.currentHighestBid + 1,
      timeRemaining: new Date(auction.endTime) - new Date(),
      isActive: auction.status === 'active' && new Date() < new Date(auction.endTime)
    });
  } catch (error) {
    console.error('Get auction details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new auction (farmers only)
router.post('/', authenticateToken, isFarmer, upload.single('image'), (req, res) => {
  try {
    const {
      cropName,
      quantity,
      unit,
      minimumBid,
      description,
      state,
      district,
      durationHours
    } = req.body;
    
    // Validation
    if (!cropName || !quantity || !minimumBid || !durationHours) {
      return res.status(400).json({ 
        message: 'Crop name, quantity, minimum bid, and duration are required' 
      });
    }
    
    const farmerId = req.user.id;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (parseInt(durationHours) * 60 * 60 * 1000));
    
    const auctionData = {
      farmerId,
      cropName,
      quantity: parseInt(quantity),
      unit: unit || 'kg',
      minimumBid: parseInt(minimumBid),
      description: description || '',
      state: state || req.user.state,
      district: district || req.user.district,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'active',
      image: req.file ? `/uploads/${req.file.filename}` : null
    };
    
    const auction = dataManager.create('auctions.json', auctionData);
    
    res.status(201).json({
      message: 'Auction created successfully',
      auction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update auction (farmers only, before any bids)
router.put('/:auctionId', authenticateToken, isFarmer, upload.single('image'), (req, res) => {
  try {
    const { auctionId } = req.params;
    const farmerId = req.user.id;
    
    const auction = dataManager.findById('auctions.json', auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.farmerId !== farmerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'Cannot update non-active auction' });
    }
    
    // Check if there are any bids
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId);
    
    if (auctionBids.length > 0) {
      return res.status(400).json({ message: 'Cannot update auction with existing bids' });
    }
    
    const updates = { ...req.body };
    
    // Handle image update
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }
    
    // Update end time if duration is changed
    if (updates.durationHours) {
      const startTime = new Date(auction.startTime);
      const endTime = new Date(startTime.getTime() + (parseInt(updates.durationHours) * 60 * 60 * 1000));
      updates.endTime = endTime.toISOString();
      delete updates.durationHours;
    }
    
    const updatedAuction = dataManager.update('auctions.json', auctionId, updates);
    
    res.json({
      message: 'Auction updated successfully',
      auction: updatedAuction
    });
  } catch (error) {
    console.error('Update auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete auction (farmers only, before any bids)
router.delete('/:auctionId', authenticateToken, isFarmer, (req, res) => {
  try {
    const { auctionId } = req.params;
    const farmerId = req.user.id;
    
    const auction = dataManager.findById('auctions.json', auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.farmerId !== farmerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if there are any bids
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId);
    
    if (auctionBids.length > 0) {
      return res.status(400).json({ message: 'Cannot delete auction with existing bids' });
    }
    
    const deleted = dataManager.delete('auctions.json', auctionId);
    
    if (deleted) {
      res.json({ message: 'Auction deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete auction' });
    }
  } catch (error) {
    console.error('Delete auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
