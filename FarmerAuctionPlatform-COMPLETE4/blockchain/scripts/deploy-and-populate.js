const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying and populating blockchain with sample data...\n");

  const [deployer, farmer1, farmer2, buyer1, buyer2] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy FarmerAuction contract
  console.log("📦 Deploying FarmerAuction contract...");
  const FarmerAuction = await ethers.getContractFactory("FarmerAuction");
  const farmerAuction = await FarmerAuction.deploy();
  await farmerAuction.waitForDeployment();
  const farmerAuctionAddress = await farmerAuction.getAddress();
  console.log("✅ FarmerAuction deployed to:", farmerAuctionAddress);

  // Deploy ProduceNFT contract
  console.log("📦 Deploying ProduceNFT contract...");
  const ProduceNFT = await ethers.getContractFactory("ProduceNFT");
  const produceNFT = await ProduceNFT.deploy();
  await produceNFT.waitForDeployment();
  const produceNFTAddress = await produceNFT.getAddress();
  console.log("✅ ProduceNFT deployed to:", produceNFTAddress);

  // Register farmers
  console.log("\n👨‍🌾 Registering farmers...");
  await farmerAuction.connect(farmer1).registerFarmer("Ravi Kumar", "Karnataka, India");
  await farmerAuction.connect(farmer2).registerFarmer("Sita Devi", "Maharashtra, India");
  console.log("✅ Farmers registered");

  // Register buyers
  console.log("🛒 Registering buyers...");
  await farmerAuction.connect(buyer1).registerBuyer("Amit Traders", "Amit Fresh Produce");
  await farmerAuction.connect(buyer2).registerBuyer("Priya Sharma", "GreenMart");
  console.log("✅ Buyers registered");

  // Create sample auctions
  console.log("\n🌾 Creating sample auctions...");
  
  // Auction 1: Premium Tomatoes
  const auction1Tx = await farmerAuction.connect(farmer1).createAuction(
    "Premium Organic Tomatoes",
    500, // quantity
    "kg",
    ethers.parseEther("0.5"), // minimum bid: 0.5 ETH
    86400, // duration: 24 hours
    "QmTomatoHash123" // IPFS hash
  );
  await auction1Tx.wait();
  console.log("✅ Created auction: Premium Organic Tomatoes (0.5 ETH minimum)");

  // Auction 2: Nashik Red Onions
  const auction2Tx = await farmerAuction.connect(farmer2).createAuction(
    "Nashik Red Onions",
    1000, // quantity
    "kg", 
    ethers.parseEther("0.3"), // minimum bid: 0.3 ETH
    172800, // duration: 48 hours
    "QmOnionHash456" // IPFS hash
  );
  await auction2Tx.wait();
  console.log("✅ Created auction: Nashik Red Onions (0.3 ETH minimum)");

  // Auction 3: Basmati Rice
  const auction3Tx = await farmerAuction.connect(farmer1).createAuction(
    "Premium Basmati Rice",
    200, // quantity
    "kg",
    ethers.parseEther("0.8"), // minimum bid: 0.8 ETH
    259200, // duration: 72 hours
    "QmRiceHash789" // IPFS hash
  );
  await auction3Tx.wait();
  console.log("✅ Created auction: Premium Basmati Rice (0.8 ETH minimum)");

  // Place sample bids
  console.log("\n💰 Placing sample bids...");
  
  // Bids on Tomatoes auction (ID: 1)
  await farmerAuction.connect(buyer1).placeBid(1, { value: ethers.parseEther("0.6") });
  console.log("✅ Buyer1 bid 0.6 ETH on Tomatoes");
  
  await farmerAuction.connect(buyer2).placeBid(1, { value: ethers.parseEther("0.75") });
  console.log("✅ Buyer2 bid 0.75 ETH on Tomatoes");

  // Bids on Onions auction (ID: 2)
  await farmerAuction.connect(buyer1).placeBid(2, { value: ethers.parseEther("0.4") });
  console.log("✅ Buyer1 bid 0.4 ETH on Onions");

  await farmerAuction.connect(buyer2).placeBid(2, { value: ethers.parseEther("0.45") });
  console.log("✅ Buyer2 bid 0.45 ETH on Onions");

  // Bids on Rice auction (ID: 3)
  await farmerAuction.connect(buyer1).placeBid(3, { value: ethers.parseEther("0.9") });
  console.log("✅ Buyer1 bid 0.9 ETH on Rice");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      FarmerAuction: {
        address: farmerAuctionAddress,
        abi: "FarmerAuction.json"
      },
      ProduceNFT: {
        address: produceNFTAddress,
        abi: "ProduceNFT.json"
      }
    },
    sampleData: {
      farmers: [
        { address: farmer1.address, name: "Ravi Kumar" },
        { address: farmer2.address, name: "Sita Devi" }
      ],
      buyers: [
        { address: buyer1.address, name: "Amit Traders" },
        { address: buyer2.address, name: "Priya Sharma" }
      ],
      auctions: [
        { id: 1, crop: "Premium Organic Tomatoes", currentBid: "0.75 ETH" },
        { id: 2, crop: "Nashik Red Onions", currentBid: "0.45 ETH" },
        { id: 3, crop: "Premium Basmati Rice", currentBid: "0.9 ETH" }
      ]
    },
    deployedAt: new Date().toISOString()
  };

  // Create deployments directory
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Copy to frontend
  const frontendContractsDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Copy ABI files
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  
  const farmerAuctionABI = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "FarmerAuction.sol/FarmerAuction.json"))
  ).abi;
  fs.writeFileSync(
    path.join(frontendContractsDir, "FarmerAuction.json"),
    JSON.stringify(farmerAuctionABI, null, 2)
  );

  const produceNFTABI = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "ProduceNFT.sol/ProduceNFT.json"))
  ).abi;
  fs.writeFileSync(
    path.join(frontendContractsDir, "ProduceNFT.json"),
    JSON.stringify(produceNFTABI, null, 2)
  );

  fs.writeFileSync(
    path.join(frontendContractsDir, "deployments.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n🎉 Blockchain setup completed successfully!");
  console.log("\n📊 Summary:");
  console.log("├── Network:", hre.network.name);
  console.log("├── FarmerAuction:", farmerAuctionAddress);
  console.log("├── ProduceNFT:", produceNFTAddress);
  console.log("├── Active Auctions: 3");
  console.log("├── Total Bids: 5");
  console.log("└── Sample Data: Ready");

  console.log("\n🔗 Test Accounts:");
  console.log("├── Farmer1 (Ravi):", farmer1.address);
  console.log("├── Farmer2 (Sita):", farmer2.address);
  console.log("├── Buyer1 (Amit):", buyer1.address);
  console.log("└── Buyer2 (Priya):", buyer2.address);

  console.log("\n🌾 Ready for blockchain trading!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
