const express = require('express');
const dataManager = require('../utils/dataManager');
const { authenticateToken, isBuyer } = require('../middleware/auth');

const router = express.Router();

// Place a bid (buyers only)
router.post('/', authenticateToken, isBuyer, (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const buyerId = req.user.id;

    // Validation
    if (!auctionId || !amount) {
      return res.status(400).json({ message: 'Auction ID and bid amount are required' });
    }

    const bidAmount = parseInt(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Use enhanced business logic validation
    const validation = dataManager.validateBid(auctionId, buyerId, bidAmount);

    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    
    // Get auction details for notifications
    const auction = dataManager.findById('auctions.json', auctionId);

    // Create the bid
    const bid = dataManager.create('bids.json', {
      auctionId,
      buyerId,
      amount: bidAmount,
      timestamp: new Date().toISOString()
    });

    // Create notification for farmer using enhanced business logic
    dataManager.createNotification(
      auction.farmerId,
      'farmer',
      'New Bid Received! 🎯',
      `A new bid of ₹${bidAmount.toLocaleString()} has been placed on your ${auction.cropName} auction.`,
      'info'
    );

    // Create notifications for other bidders (they've been outbid)
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId && bid.buyerId !== buyerId);
    const otherBidders = [...new Set(auctionBids.map(b => b.buyerId))];

    otherBidders.forEach(otherBuyerId => {
      dataManager.createNotification(
        otherBuyerId,
        'buyer',
        'You have been outbid! ⚠️',
        `Someone placed a higher bid of ₹${bidAmount.toLocaleString()} on the ${auction.cropName} auction.`,
        'warning'
      );
    });
    
    // Get buyer info for the response
    const buyer = dataManager.findById('buyers.json', buyerId);
    
    const bidResponse = {
      ...bid,
      buyerName: buyer ? buyer.name : 'Anonymous',
      buyerLocation: buyer ? buyer.location : 'Unknown'
    };
    
    res.status(201).json({
      message: 'Bid placed successfully',
      bid: bidResponse,
      currentHighestBid: bidAmount
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bids for a specific auction
router.get('/auction/:auctionId', (req, res) => {
  try {
    const { auctionId } = req.params;
    
    // Check if auction exists
    const auction = dataManager.findById('auctions.json', auctionId);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    // Get all bids for this auction
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId);
    
    // Add buyer information to each bid
    const allBuyers = dataManager.getAll('buyers.json');
    const bidsWithBuyerInfo = auctionBids.map(bid => {
      const buyer = allBuyers.find(b => b.id === bid.buyerId);
      return {
        ...bid,
        buyerName: buyer ? buyer.name : 'Anonymous',
        buyerLocation: buyer ? buyer.location : 'Unknown'
      };
    });
    
    // Sort by amount (highest first)
    bidsWithBuyerInfo.sort((a, b) => b.amount - a.amount);
    
    res.json({
      auctionId,
      bids: bidsWithBuyerInfo,
      bidCount: bidsWithBuyerInfo.length,
      currentHighestBid: bidsWithBuyerInfo.length > 0 ? bidsWithBuyerInfo[0].amount : auction.minimumBid
    });
  } catch (error) {
    console.error('Get auction bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's bid history
router.get('/my-bids', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;

    // Use enhanced business logic to get bids with complete information
    const bidsWithInfo = dataManager.getBidsWithAuctionInfo(buyerId);

    // Sort by creation date (newest first)
    bidsWithInfo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(bidsWithInfo);
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific bid details
router.get('/:bidId', authenticateToken, (req, res) => {
  try {
    const { bidId } = req.params;
    const userId = req.user.id;
    const userType = req.user.userType;
    
    const bid = dataManager.findById('bids.json', bidId);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    // Get auction details
    const auction = dataManager.findById('auctions.json', bid.auctionId);
    
    // Check access permissions
    if (userType === 'buyer' && bid.buyerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (userType === 'farmer' && auction && auction.farmerId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Add buyer and auction information
    const buyer = dataManager.findById('buyers.json', bid.buyerId);
    
    const bidResponse = {
      ...bid,
      buyerInfo: buyer ? {
        name: buyer.name,
        location: buyer.location,
        phone: userType === 'farmer' ? buyer.phone : undefined // Only show phone to farmer
      } : null,
      auctionInfo: auction ? {
        cropName: auction.cropName,
        quantity: auction.quantity,
        unit: auction.unit,
        status: auction.status
      } : null
    };
    
    res.json(bidResponse);
  } catch (error) {
    console.error('Get bid details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel/withdraw a bid (only if it's not the highest bid and auction is still active)
router.delete('/:bidId', authenticateToken, isBuyer, (req, res) => {
  try {
    const { bidId } = req.params;
    const buyerId = req.user.id;
    
    const bid = dataManager.findById('bids.json', bidId);
    
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }
    
    if (bid.buyerId !== buyerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get auction details
    const auction = dataManager.findById('auctions.json', bid.auctionId);
    
    if (!auction || auction.status !== 'active') {
      return res.status(400).json({ message: 'Cannot cancel bid on inactive auction' });
    }
    
    // Check if this is the highest bid
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(b => b.auctionId === bid.auctionId);
    const highestBid = Math.max(...auctionBids.map(b => b.amount));
    
    if (bid.amount === highestBid) {
      return res.status(400).json({ message: 'Cannot cancel the highest bid' });
    }
    
    // Delete the bid
    const deleted = dataManager.delete('bids.json', bidId);
    
    if (deleted) {
      res.json({ message: 'Bid cancelled successfully' });
    } else {
      res.status(500).json({ message: 'Failed to cancel bid' });
    }
  } catch (error) {
    console.error('Cancel bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
