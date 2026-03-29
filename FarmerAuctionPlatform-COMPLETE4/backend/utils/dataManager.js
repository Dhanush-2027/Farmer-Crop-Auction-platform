const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class DataManager {
  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.ensureDataFiles();
  }

  ensureDataFiles() {
    const files = [
      'farmers.json',
      'buyers.json',
      'auctions.json',
      'bids.json',
      'notifications.json'
    ];

    files.forEach(file => {
      const filePath = path.join(this.dataDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      }
    });
  }

  readData(filename) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  writeData(filename, data) {
    try {
      const filePath = path.join(this.dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  // Generic CRUD operations
  create(filename, item) {
    const data = this.readData(filename);
    const newItem = { id: uuidv4(), ...item, createdAt: new Date().toISOString() };
    data.push(newItem);
    this.writeData(filename, data);
    return newItem;
  }

  findById(filename, id) {
    const data = this.readData(filename);
    return data.find(item => item.id === id);
  }

  findByField(filename, field, value) {
    const data = this.readData(filename);
    return data.filter(item => item[field] === value);
  }

  update(filename, id, updates) {
    const data = this.readData(filename);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      this.writeData(filename, data);
      return data[index];
    }
    return null;
  }

  delete(filename, id) {
    const data = this.readData(filename);
    const filteredData = data.filter(item => item.id !== id);
    this.writeData(filename, filteredData);
    return filteredData.length < data.length;
  }

  getAll(filename) {
    return this.readData(filename);
  }

  // Business Logic Methods
  updateAuctionStatus(auction) {
    const now = moment();
    const endTime = moment(auction.endTime);

    if (now.isAfter(endTime) && auction.status === 'active') {
      auction.status = 'ended';

      // Determine winner
      const bids = this.findByField('bids.json', 'auctionId', auction.id);
      if (bids.length > 0) {
        const winningBid = bids.reduce((highest, current) =>
          current.amount > highest.amount ? current : highest
        );
        auction.winnerId = winningBid.buyerId;
        auction.winningBid = winningBid.amount;
        auction.status = 'sold';

        // Update auction in database
        this.update('auctions.json', auction.id, auction);

        // Create notifications
        this.createNotification(
          winningBid.buyerId,
          'buyer',
          'Auction Won!',
          `Congratulations! You won the auction for ${auction.cropName}`,
          'success'
        );

        this.createNotification(
          auction.farmerId,
          'farmer',
          'Auction Sold!',
          `Your ${auction.cropName} auction has been sold for ₹${winningBid.amount}`,
          'success'
        );
      }
    }

    return auction;
  }

  calculateBidStatus(bid, auction, allBids) {
    if (auction.status === 'ended' || auction.status === 'sold') {
      const auctionBids = allBids.filter(b => b.auctionId === auction.id);
      if (auctionBids.length === 0) return 'lost';

      const highestBid = auctionBids.reduce((highest, current) =>
        current.amount > highest.amount ? current : highest
      );

      return bid.id === highestBid.id ? 'won' : 'lost';
    }

    const activeBids = allBids.filter(b => b.auctionId === auction.id);
    if (activeBids.length === 0) return 'winning';

    const currentHighest = activeBids.reduce((highest, current) =>
      current.amount > highest.amount ? current : highest
    );

    return bid.id === currentHighest.id ? 'winning' : 'outbid';
  }

  getAuctionWithBidInfo(auction) {
    const bids = this.findByField('bids.json', 'auctionId', auction.id);
    const farmer = this.findById('farmers.json', auction.farmerId);

    let currentHighestBid = auction.minimumBid;
    let bidCount = bids.length;

    if (bids.length > 0) {
      currentHighestBid = Math.max(...bids.map(bid => bid.amount));
    }

    // Update auction status
    const updatedAuction = this.updateAuctionStatus({ ...auction });

    return {
      ...updatedAuction,
      currentHighestBid,
      bidCount,
      farmerInfo: farmer ? {
        name: farmer.name,
        location: `${farmer.district}, ${farmer.state}`,
        verified: farmer.verified || false,
        phone: farmer.phone
      } : null
    };
  }

  createNotification(userId, userType, title, message, type = 'info') {
    const newNotification = {
      id: uuidv4(),
      userId,
      userType,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };

    const notifications = this.readData('notifications.json');
    notifications.push(newNotification);
    this.writeData('notifications.json', notifications);
    return newNotification;
  }

  validateBid(auctionId, buyerId, amount) {
    const auction = this.findById('auctions.json', auctionId);

    if (!auction) {
      return { valid: false, message: 'Auction not found' };
    }

    if (auction.status !== 'active') {
      return { valid: false, message: 'Auction is not active' };
    }

    if (moment().isAfter(moment(auction.endTime))) {
      return { valid: false, message: 'Auction has ended' };
    }

    // Check if buyer is trying to bid on their own auction (if they're also a farmer)
    if (auction.farmerId === buyerId) {
      return { valid: false, message: 'Cannot bid on your own auction' };
    }

    const bids = this.findByField('bids.json', 'auctionId', auctionId);
    const currentHighest = bids.length > 0 ?
      Math.max(...bids.map(bid => bid.amount)) : auction.minimumBid;

    const minimumBidIncrement = Math.max(1, Math.floor(currentHighest * 0.05)); // 5% increment
    const minimumNextBid = currentHighest + minimumBidIncrement;

    if (amount < minimumNextBid) {
      return {
        valid: false,
        message: `Minimum bid is ₹${minimumNextBid.toLocaleString()} (₹${minimumBidIncrement.toLocaleString()} above current highest)`
      };
    }

    return { valid: true, minimumNextBid, currentHighest };
  }

  // Enhanced data retrieval methods
  getAuctionsWithBidInfo() {
    const auctions = this.readData('auctions.json');
    return auctions.map(auction => this.getAuctionWithBidInfo(auction));
  }

  getBidsWithAuctionInfo(buyerId = null) {
    const bids = this.readData('bids.json');
    const auctions = this.readData('auctions.json');
    const buyers = this.readData('buyers.json');

    let filteredBids = buyerId ? bids.filter(bid => bid.buyerId === buyerId) : bids;

    return filteredBids.map(bid => {
      const auction = auctions.find(a => a.id === bid.auctionId);
      const buyer = buyers.find(b => b.id === bid.buyerId);

      return {
        ...bid,
        bidStatus: auction ? this.calculateBidStatus(bid, auction, bids) : 'unknown',
        auctionInfo: auction ? {
          cropName: auction.cropName,
          quantity: auction.quantity,
          unit: auction.unit,
          endTime: auction.endTime,
          status: auction.status,
          currentHighestBid: this.getAuctionWithBidInfo(auction).currentHighestBid,
          farmerLocation: `${auction.district}, ${auction.state}`
        } : null,
        buyerInfo: buyer ? {
          name: buyer.name,
          location: `${buyer.city}, ${buyer.state}`
        } : null
      };
    });
  }

  getFarmerDashboardData(farmerId) {
    const farmer = this.findById('farmers.json', farmerId);
    const auctions = this.findByField('auctions.json', 'farmerId', farmerId);
    const allBids = this.readData('bids.json');

    // Calculate statistics
    const totalAuctions = auctions.length;
    const activeAuctions = auctions.filter(a => a.status === 'active').length;
    const soldAuctions = auctions.filter(a => a.status === 'sold').length;
    const totalRevenue = auctions
      .filter(a => a.status === 'sold')
      .reduce((sum, a) => sum + (a.winningBid || 0), 0);

    // Get auctions with bid info
    const auctionsWithBids = auctions.map(auction => this.getAuctionWithBidInfo(auction));

    // Calculate completion percentage
    const profileCompletion = this.calculateProfileCompletion(farmer);

    return {
      farmer,
      statistics: {
        totalAuctions,
        activeAuctions,
        soldAuctions,
        totalRevenue,
        profileCompletion
      },
      auctions: auctionsWithBids,
      recentBids: allBids
        .filter(bid => auctions.some(a => a.id === bid.auctionId))
        .slice(-5)
    };
  }

  getBuyerDashboardData(buyerId) {
    const buyer = this.findById('buyers.json', buyerId);
    const bids = this.findByField('bids.json', 'buyerId', buyerId);
    const auctions = this.readData('auctions.json');

    // Calculate statistics
    const totalBids = bids.length;
    const activeBids = bids.filter(bid => {
      const auction = auctions.find(a => a.id === bid.auctionId);
      return auction && auction.status === 'active';
    }).length;

    const wonAuctions = bids.filter(bid => {
      const auction = auctions.find(a => a.id === bid.auctionId);
      return auction && auction.winnerId === buyerId;
    }).length;

    const totalSpent = bids
      .filter(bid => {
        const auction = auctions.find(a => a.id === bid.auctionId);
        return auction && auction.winnerId === buyerId;
      })
      .reduce((sum, bid) => sum + bid.amount, 0);

    // Get recommended auctions based on buyer's interests
    const recommendedAuctions = this.getRecommendedAuctions(buyer);

    // Get recent bids with status
    const recentBids = this.getBidsWithAuctionInfo(buyerId).slice(-10);

    return {
      buyer,
      statistics: {
        totalBids,
        activeAuctions: activeBids,
        wonAuctions,
        totalSpent
      },
      recommendedAuctions,
      recentBids
    };
  }

  getRecommendedAuctions(buyer, limit = 6) {
    const auctions = this.getAuctionsWithBidInfo();
    const activeAuctions = auctions.filter(a => a.status === 'active');

    // If buyer has interested crops, prioritize those
    if (buyer.interestedCrops && buyer.interestedCrops.length > 0) {
      const matchingAuctions = activeAuctions.filter(auction =>
        buyer.interestedCrops.some(crop =>
          auction.cropName.toLowerCase().includes(crop.toLowerCase())
        )
      );

      if (matchingAuctions.length >= limit) {
        return matchingAuctions.slice(0, limit);
      }

      // Fill remaining slots with other auctions
      const otherAuctions = activeAuctions.filter(auction =>
        !buyer.interestedCrops.some(crop =>
          auction.cropName.toLowerCase().includes(crop.toLowerCase())
        )
      );

      return [...matchingAuctions, ...otherAuctions].slice(0, limit);
    }

    // If no interests specified, return recent auctions
    return activeAuctions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }

  calculateProfileCompletion(user) {
    const requiredFields = ['name', 'phone', 'state', 'district'];
    const optionalFields = ['bankAccount', 'ifscCode', 'address'];

    const completedRequired = requiredFields.filter(field => user[field]).length;
    const completedOptional = optionalFields.filter(field => user[field]).length;

    const requiredScore = (completedRequired / requiredFields.length) * 70; // 70% for required
    const optionalScore = (completedOptional / optionalFields.length) * 30; // 30% for optional

    return Math.round(requiredScore + optionalScore);
  }
}

module.exports = new DataManager();
