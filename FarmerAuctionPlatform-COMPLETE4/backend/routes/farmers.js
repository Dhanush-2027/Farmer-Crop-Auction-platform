const express = require('express');
const dataManager = require('../utils/dataManager');
const { authenticateToken, isFarmer } = require('../middleware/auth');

const router = express.Router();

// Get farmer dashboard data
router.get('/dashboard', authenticateToken, isFarmer, (req, res) => {
  try {
    const farmerId = req.user.id;

    // Use enhanced business logic to get comprehensive dashboard data
    const dashboardData = dataManager.getFarmerDashboardData(farmerId);

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all farmer's auctions
router.get('/auctions', authenticateToken, isFarmer, (req, res) => {
  try {
    const farmerId = req.user.id;
    const allAuctions = dataManager.getAll('auctions.json');
    const farmerAuctions = allAuctions.filter(auction => auction.farmerId === farmerId);
    
    // Add bid counts to each auction
    const allBids = dataManager.getAll('bids.json');
    const auctionsWithBids = farmerAuctions.map(auction => {
      const auctionBids = allBids.filter(bid => bid.auctionId === auction.id);
      const highestBid = auctionBids.length > 0 
        ? Math.max(...auctionBids.map(bid => bid.amount))
        : auction.minimumBid;
      
      return {
        ...auction,
        bidCount: auctionBids.length,
        currentHighestBid: highestBid,
        bids: auctionBids.sort((a, b) => b.amount - a.amount)
      };
    });
    
    res.json(auctionsWithBids);
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific auction details
router.get('/auctions/:auctionId', authenticateToken, isFarmer, (req, res) => {
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
    
    // Get all bids for this auction
    const allBids = dataManager.getAll('bids.json');
    const auctionBids = allBids.filter(bid => bid.auctionId === auctionId);
    
    // Get buyer details for each bid
    const buyers = dataManager.getAll('buyers.json');
    const bidsWithBuyerInfo = auctionBids.map(bid => {
      const buyer = buyers.find(b => b.id === bid.buyerId);
      return {
        ...bid,
        buyerName: buyer ? buyer.name : 'Unknown',
        buyerLocation: buyer ? buyer.location : 'Unknown'
      };
    }).sort((a, b) => b.amount - a.amount);
    
    res.json({
      ...auction,
      bids: bidsWithBuyerInfo,
      bidCount: bidsWithBuyerInfo.length,
      currentHighestBid: bidsWithBuyerInfo.length > 0 ? bidsWithBuyerInfo[0].amount : auction.minimumBid
    });
  } catch (error) {
    console.error('Get auction details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept/Reject auction result
router.post('/auctions/:auctionId/result', authenticateToken, isFarmer, (req, res) => {
  try {
    const { auctionId } = req.params;
    const { action, winningBidId } = req.body; // action: 'accept' or 'reject'
    const farmerId = req.user.id;
    
    const auction = dataManager.findById('auctions.json', auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (auction.farmerId !== farmerId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (auction.status !== 'ended') {
      return res.status(400).json({ message: 'Auction is not ended yet' });
    }
    
    let updatedAuction;
    
    if (action === 'accept') {
      const winningBid = dataManager.findById('bids.json', winningBidId);
      if (!winningBid) {
        return res.status(404).json({ message: 'Winning bid not found' });
      }
      
      updatedAuction = dataManager.update('auctions.json', auctionId, {
        status: 'completed',
        winningBid: winningBid.amount,
        winningBuyerId: winningBid.buyerId,
        resultAcceptedAt: new Date().toISOString()
      });
      
      // Create notification for winning buyer
      dataManager.create('notifications.json', {
        userId: winningBid.buyerId,
        type: 'auction_won',
        title: 'Congratulations! You won the auction',
        message: `Your bid of ₹${winningBid.amount} for ${auction.cropName} has been accepted by the farmer.`,
        auctionId: auctionId,
        isRead: false
      });
      
    } else if (action === 'reject') {
      updatedAuction = dataManager.update('auctions.json', auctionId, {
        status: 'rejected',
        resultRejectedAt: new Date().toISOString()
      });
    }
    
    res.json({
      message: `Auction result ${action}ed successfully`,
      auction: updatedAuction
    });
  } catch (error) {
    console.error('Auction result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's notifications
router.get('/notifications', authenticateToken, isFarmer, (req, res) => {
  try {
    const farmerId = req.user.id;
    const notifications = dataManager.findByField('notifications.json', 'userId', farmerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/notifications/:notificationId/read', authenticateToken, isFarmer, (req, res) => {
  try {
    const { notificationId } = req.params;
    const farmerId = req.user.id;
    
    const notification = dataManager.findById('notifications.json', notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.userId !== farmerId) {
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

module.exports = router;
