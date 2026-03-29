const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of Farmer Auction Smart Contracts...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
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

  // Save deployment addresses
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
    deployedAt: new Date().toISOString()
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Copy ABIs to frontend
  const frontendContractsDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Copy ABI files
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  
  // Copy FarmerAuction ABI
  const farmerAuctionABI = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "FarmerAuction.sol/FarmerAuction.json"))
  ).abi;
  fs.writeFileSync(
    path.join(frontendContractsDir, "FarmerAuction.json"),
    JSON.stringify(farmerAuctionABI, null, 2)
  );

  // Copy ProduceNFT ABI
  const produceNFTABI = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "ProduceNFT.sol/ProduceNFT.json"))
  ).abi;
  fs.writeFileSync(
    path.join(frontendContractsDir, "ProduceNFT.json"),
    JSON.stringify(produceNFTABI, null, 2)
  );

  // Copy deployment info to frontend
  fs.writeFileSync(
    path.join(frontendContractsDir, "deployments.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📋 ABIs and deployment info copied to frontend");

  // Verify contracts on Etherscan (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await farmerAuction.deploymentTransaction().wait(6);
    await produceNFT.deploymentTransaction().wait(6);

    console.log("🔍 Verifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: farmerAuctionAddress,
        constructorArguments: [],
      });
      console.log("✅ FarmerAuction verified");
    } catch (error) {
      console.log("❌ FarmerAuction verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: produceNFTAddress,
        constructorArguments: [],
      });
      console.log("✅ ProduceNFT verified");
    } catch (error) {
      console.log("❌ ProduceNFT verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📊 Summary:");
  console.log("├── Network:", hre.network.name);
  console.log("├── Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());
  console.log("├── FarmerAuction:", farmerAuctionAddress);
  console.log("├── ProduceNFT:", produceNFTAddress);
  console.log("└── Gas Used: Check transaction receipts");

  console.log("\n🔗 Next Steps:");
  console.log("1. Update frontend environment variables");
  console.log("2. Test contract interactions");
  console.log("3. Set up IPFS for metadata storage");
  console.log("4. Configure MetaMask for users");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
