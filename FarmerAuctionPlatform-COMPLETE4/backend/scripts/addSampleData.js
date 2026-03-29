const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Enhanced sample data with realistic business logic
const sampleFarmers = [
  {
    id: uuidv4(),
    name: "Ravi Kumar",
    phone: "9876543210",
    state: "Karnataka",
    district: "Kolar",
    address: "Village Mulbagal, Kolar District",
    crops: ["Tomato", "Onion", "Potato"],
    password: bcrypt.hashSync("farmer123", 10),
    userType: "farmer",
    language: "en",
    isActive: true,
    verified: true,
    bankAccount: "1234567890123456",
    ifscCode: "SBIN0001234",
    experience: "15 years",
    farmSize: "5 acres",
    organicCertified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Sita Devi",
    phone: "9876543211",
    state: "Maharashtra",
    district: "Nashik",
    address: "Lasalgaon, Nashik District",
    crops: ["Onion", "Grapes", "Pomegranate"],
    password: bcrypt.hashSync("farmer123", 10),
    userType: "farmer",
    language: "hi",
    isActive: true,
    verified: true,
    bankAccount: "0987654321098765",
    ifscCode: "HDFC0001234",
    experience: "12 years",
    farmSize: "8 acres",
    organicCertified: false,
    createdAt: new Date().toISOString()
  }
];

const sampleBuyers = [
  {
    id: uuidv4(),
    name: "Amit Traders",
    phone: "8765432101",
    businessName: "Amit Fresh Produce",
    city: "Bangalore",
    state: "Karnataka",
    address: "KR Market, Bangalore",
    interestedCrops: ["Tomato", "Potato", "Onion"],
    businessType: "Wholesale",
    password: bcrypt.hashSync("buyer123", 10),
    userType: "buyer",
    language: "en",
    isActive: true,
    businessLicense: "WHL-KAR-2023-001",
    establishedYear: 2015,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Priya Sharma",
    phone: "8765432102",
    businessName: "GreenMart",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Vashi Market, Navi Mumbai",
    interestedCrops: ["Onion", "Tomato", "Grapes"],
    businessType: "Retail",
    password: bcrypt.hashSync("buyer123", 10),
    userType: "buyer",
    language: "hi",
    isActive: true,
    businessLicense: "RTL-MAH-2023-002",
    establishedYear: 2018,
    createdAt: new Date().toISOString()
  },
  {
    id: "suhas-buyer-id",
    name: "suhas",
    phone: "8618093520",
    businessName: "Suhas Trading Co",
    city: "Hyderabad",
    state: "Telangana",
    address: "Begum Bazaar, Hyderabad",
    interestedCrops: ["Tomato", "Onion", "Rice"],
    businessType: "Wholesale",
    password: bcrypt.hashSync("suhas123", 10),
    userType: "buyer",
    language: "en",
    isActive: true,
    businessLicense: "WHL-TEL-2023-003",
    establishedYear: 2020,
    createdAt: new Date().toISOString()
  }
];

const sampleAuctions = [
  {
    id: uuidv4(),
    farmerId: sampleFarmers[0].id,
    cropName: "Premium Tomatoes",
    quantity: 500,
    unit: "kg",
    minimumBid: 14000, // ₹28 per kg for 500kg = ₹14,000 minimum (current market rate)
    description: "Premium quality organic tomatoes, freshly harvested. Grade A quality, perfect for retail and wholesale. Pesticide-free and certified organic.",
    state: "Karnataka",
    district: "Kolar",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Started 2 hours ago
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // Ends in 6 hours
    status: "active",
    image: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    farmerId: sampleFarmers[1].id,
    cropName: "Nashik Red Onions",
    quantity: 1000,
    unit: "kg",
    minimumBid: 22000, // ₹22 per kg for 1000kg = ₹22,000 minimum (current market rate)
    description: "High quality red onions from Nashik, excellent for export and domestic markets. Good storage life, uniform size, and excellent taste.",
    state: "Maharashtra",
    district: "Nashik",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Started 1 hour ago
    endTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(), // Ends in 23 hours
    status: "active",
    image: null,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

const sampleBids = [
  {
    id: uuidv4(),
    auctionId: sampleAuctions[0].id,
    buyerId: sampleBuyers[0].id,
    amount: 14700, // ₹29.40 per kg - 5% above minimum (500kg × ₹29.40)
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 minutes ago
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    auctionId: sampleAuctions[0].id,
    buyerId: sampleBuyers[1].id,
    amount: 15500, // ₹31 per kg - current highest bid (500kg × ₹31)
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    auctionId: sampleAuctions[1].id,
    buyerId: sampleBuyers[0].id,
    amount: 23100, // ₹23.10 per kg - 5% above minimum (1000kg × ₹23.10)
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    auctionId: sampleAuctions[1].id,
    buyerId: sampleBuyers[1].id,
    amount: 24500, // ₹24.50 per kg - current highest bid (1000kg × ₹24.50)
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  // Bids for suhas user
  {
    id: uuidv4(),
    auctionId: sampleAuctions[0].id,
    buyerId: "suhas-buyer-id",
    amount: 14500, // ₹29 per kg - outbid by higher bid (500kg × ₹29)
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    auctionId: sampleAuctions[1].id,
    buyerId: "suhas-buyer-id",
    amount: 23500, // ₹23.50 per kg - outbid by higher bid (1000kg × ₹23.50)
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

const sampleNotifications = [
  {
    id: uuidv4(),
    userId: sampleFarmers[0].id,
    userType: "farmer",
    type: "info",
    title: "New Bid Received! 🎯",
    message: "A new bid of ₹15,500 has been placed on your Premium Tomatoes auction.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    userId: sampleBuyers[0].id,
    userType: "buyer",
    type: "warning",
    title: "You have been outbid! ⚠️",
    message: "Someone placed a higher bid of ₹15,500 on the Premium Tomatoes auction.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    userId: sampleFarmers[1].id,
    userType: "farmer",
    type: "info",
    title: "New Bid Received! 🎯",
    message: "A new bid of ₹24,500 has been placed on your Nashik Red Onions auction.",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    userId: sampleBuyers[0].id,
    userType: "buyer",
    type: "warning",
    title: "You have been outbid! ⚠️",
    message: "Someone placed a higher bid of ₹24,500 on the Nashik Red Onions auction.",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    userId: sampleFarmers[0].id,
    userType: "farmer",
    type: "success",
    title: "Profile Verification Complete! ✅",
    message: "Your farmer profile has been verified. You can now create auctions with verified badge.",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  // Notifications for suhas
  {
    id: uuidv4(),
    userId: "suhas-buyer-id",
    userType: "buyer",
    type: "warning",
    title: "You have been outbid! ⚠️",
    message: "Someone placed a higher bid of ₹15,500 on the Premium Tomatoes auction.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: uuidv4(),
    userId: "suhas-buyer-id",
    userType: "buyer",
    type: "warning",
    title: "You have been outbid! ⚠️",
    message: "Someone placed a higher bid of ₹24,500 on the Nashik Red Onions auction.",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

// Function to write data to JSON files
function writeDataToFile(filename, data) {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Sample data written to ${filename}`);
}

// Main function to add sample data
function addSampleData() {
  console.log('🌱 Adding sample data to the application...\n');

  try {
    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write sample data to files
    writeDataToFile('farmers.json', sampleFarmers);
    writeDataToFile('buyers.json', sampleBuyers);
    writeDataToFile('auctions.json', sampleAuctions);
    writeDataToFile('bids.json', sampleBids);
    writeDataToFile('notifications.json', sampleNotifications);

    console.log('\n🎉 Sample data added successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👨‍🌾 Farmer Login:');
    console.log('   Phone: 9876543210, Password: farmer123');
    console.log('   Phone: 9876543211, Password: farmer123');
    console.log('\n🛒 Buyer Login:');
    console.log('   Phone: 8765432101, Password: buyer123');
    console.log('   Phone: 8765432102, Password: buyer123');
    console.log('\n🌐 You can now test the application with these accounts!');

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

// Run the script
if (require.main === module) {
  addSampleData();
}

module.exports = { addSampleData };
