const express = require('express');
const dataManager = require('../utils/dataManager');
const { authenticateToken, isBuyer } = require('../middleware/auth');

const router = express.Router();

// Get buyer dashboard data
router.get('/dashboard', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;

    // Use enhanced business logic to get comprehensive dashboard data
    const dashboardData = dataManager.getBuyerDashboardData(buyerId);

    res.json(dashboardData);
  } catch (error) {
    console.error('Buyer dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's bid history
router.get('/bids', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;
    const allBids = dataManager.getAll('bids.json');
    const buyerBids = allBids.filter(bid => bid.buyerId === buyerId);
    
    // Add auction details to each bid
    const allAuctions = dataManager.getAll('auctions.json');
    const bidsWithAuctionInfo = buyerBids.map(bid => {
      const auction = allAuctions.find(a => a.id === bid.auctionId);
      return {
        ...bid,
        auctionInfo: auction ? {
          cropName: auction.cropName,
          quantity: auction.quantity,
          status: auction.status,
          endTime: auction.endTime,
          farmerId: auction.farmerId
        } : null
      };
    });
    
    // Sort by creation date (newest first)
    bidsWithAuctionInfo.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(bidsWithAuctionInfo);
  } catch (error) {
    console.error('Get bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's won auctions
router.get('/won-auctions', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;
    const allAuctions = dataManager.getAll('auctions.json');
    const wonAuctions = allAuctions.filter(auction => 
      auction.status === 'completed' && auction.winningBuyerId === buyerId
    );
    
    // Add farmer details to each won auction
    const allFarmers = dataManager.getAll('farmers.json');
    const wonAuctionsWithFarmerInfo = wonAuctions.map(auction => {
      const farmer = allFarmers.find(f => f.id === auction.farmerId);
      return {
        ...auction,
        farmerInfo: farmer ? {
          name: farmer.name,
          phone: farmer.phone,
          location: `${farmer.district}, ${farmer.state}`
        } : null
      };
    });
    
    res.json(wonAuctionsWithFarmerInfo);
  } catch (error) {
    console.error('Get won auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's notifications
router.get('/notifications', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;
    const notifications = dataManager.findByField('notifications.json', 'userId', buyerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:notificationId/read', authenticateToken, isBuyer, (req, res) => {
  try {
    const { notificationId } = req.params;
    const buyerId = req.user.id;
    
    const notification = dataManager.findById('notifications.json', notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== buyerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updatedNotification = dataManager.update('notifications.json', notificationId, {
      isRead: true,
      readAt: new Date().toISOString()
    });
    
    res.json(updatedNotification);
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended auctions based on buyer's interests
router.get('/recommended-auctions', authenticateToken, isBuyer, (req, res) => {
  try {
    const buyerId = req.user.id;
    const buyer = dataManager.findById('buyers.json', buyerId);
    
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    
    const allAuctions = dataManager.getAll('auctions.json');
    const interestedCrops = buyer.interestedCrops || [];
    
    // Filter auctions based on buyer's interests
    const recommendedAuctions = allAuctions.filter(auction => {
      if (auction.status !== 'active') return false;
      
      return interestedCrops.some(crop => 
        auction.cropName.toLowerCase().includes(crop.toLowerCase()) ||
        auction.description?.toLowerCase().includes(crop.toLowerCase())
      );
    });
    
    // Add farmer info and current bid info
    const allFarmers = dataManager.getAll('farmers.json');
    const allBids = dataManager.getAll('bids.json');
    
    const enrichedAuctions = recommendedAuctions.map(auction => {
      const farmer = allFarmers.find(f => f.id === auction.farmerId);
      const auctionBids = allBids.filter(bid => bid.auctionId === auction.id);
      const currentHighestBid = auctionBids.length > 0 
        ? Math.max(...auctionBids.map(bid => bid.amount))
        : auction.minimumBid;
      
      return {
        ...auction,
        farmerInfo: farmer ? {
          name: farmer.name,
          location: `${farmer.district}, ${farmer.state}`
        } : null,
        currentHighestBid,
        bidCount: auctionBids.length
      };
    });
    
    // Sort by end time (ending soon first)
    enrichedAuctions.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    
    res.json(enrichedAuctions);
  } catch (error) {
    console.error('Get recommended auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
