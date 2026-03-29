// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FarmerAuction is ReentrancyGuard, Ownable {
    
    struct Auction {
        uint256 id;
        address farmer;
        string cropName;
        uint256 quantity;
        string unit;
        uint256 minimumBid;
        uint256 startTime;
        uint256 endTime;
        uint256 highestBid;
        address highestBidder;
        bool ended;
        bool paid;
        string ipfsHash; // For storing crop details/images
    }
    
    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }
    
    struct Farmer {
        address wallet;
        string name;
        string location;
        bool verified;
        uint256 totalAuctions;
        uint256 totalRevenue;
    }
    
    struct Buyer {
        address wallet;
        string name;
        string businessName;
        uint256 totalBids;
        uint256 totalSpent;
    }
    
    // State variables
    uint256 public auctionCounter;
    uint256 public platformFee = 250; // 2.5% in basis points
    
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(address => Farmer) public farmers;
    mapping(address => Buyer) public buyers;
    mapping(address => uint256[]) public farmerAuctions;
    mapping(address => uint256[]) public buyerBids;
    
    // Events
    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed farmer,
        string cropName,
        uint256 quantity,
        uint256 minimumBid,
        uint256 endTime
    );
    
    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount,
        uint256 timestamp
    );
    
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 winningBid
    );
    
    event PaymentReleased(
        uint256 indexed auctionId,
        address indexed farmer,
        address indexed buyer,
        uint256 amount
    );
    
    event FarmerRegistered(address indexed farmer, string name);
    event BuyerRegistered(address indexed buyer, string name);
    
    // Modifiers
    modifier onlyRegisteredFarmer() {
        require(bytes(farmers[msg.sender].name).length > 0, "Not a registered farmer");
        _;
    }
    
    modifier onlyRegisteredBuyer() {
        require(bytes(buyers[msg.sender].name).length > 0, "Not a registered buyer");
        _;
    }
    
    modifier auctionExists(uint256 _auctionId) {
        require(_auctionId > 0 && _auctionId <= auctionCounter, "Auction does not exist");
        _;
    }
    
    modifier auctionActive(uint256 _auctionId) {
        require(block.timestamp < auctions[_auctionId].endTime, "Auction has ended");
        require(!auctions[_auctionId].ended, "Auction already ended");
        _;
    }
    
    constructor() {}
    
    // Registration functions
    function registerFarmer(string memory _name, string memory _location) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        farmers[msg.sender] = Farmer({
            wallet: msg.sender,
            name: _name,
            location: _location,
            verified: false,
            totalAuctions: 0,
            totalRevenue: 0
        });
        
        emit FarmerRegistered(msg.sender, _name);
    }
    
    function registerBuyer(string memory _name, string memory _businessName) external {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        buyers[msg.sender] = Buyer({
            wallet: msg.sender,
            name: _name,
            businessName: _businessName,
            totalBids: 0,
            totalSpent: 0
        });
        
        emit BuyerRegistered(msg.sender, _name);
    }
    
    // Auction functions
    function createAuction(
        string memory _cropName,
        uint256 _quantity,
        string memory _unit,
        uint256 _minimumBid,
        uint256 _duration,
        string memory _ipfsHash
    ) external onlyRegisteredFarmer returns (uint256) {
        require(bytes(_cropName).length > 0, "Crop name cannot be empty");
        require(_quantity > 0, "Quantity must be greater than 0");
        require(_minimumBid > 0, "Minimum bid must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        
        auctionCounter++;
        uint256 auctionId = auctionCounter;
        
        auctions[auctionId] = Auction({
            id: auctionId,
            farmer: msg.sender,
            cropName: _cropName,
            quantity: _quantity,
            unit: _unit,
            minimumBid: _minimumBid,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            highestBid: 0,
            highestBidder: address(0),
            ended: false,
            paid: false,
            ipfsHash: _ipfsHash
        });
        
        farmerAuctions[msg.sender].push(auctionId);
        farmers[msg.sender].totalAuctions++;
        
        emit AuctionCreated(
            auctionId,
            msg.sender,
            _cropName,
            _quantity,
            _minimumBid,
            block.timestamp + _duration
        );
        
        return auctionId;
    }
    
    function placeBid(uint256 _auctionId) 
        external 
        payable 
        onlyRegisteredBuyer 
        auctionExists(_auctionId) 
        auctionActive(_auctionId) 
        nonReentrant 
    {
        Auction storage auction = auctions[_auctionId];
        
        require(msg.sender != auction.farmer, "Farmers cannot bid on their own auctions");
        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");
        require(msg.value >= auction.minimumBid, "Bid must be at least minimum bid");
        
        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }
        
        // Update auction
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        
        // Record bid
        auctionBids[_auctionId].push(Bid({
            bidder: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        buyerBids[msg.sender].push(_auctionId);
        buyers[msg.sender].totalBids++;
        
        emit BidPlaced(_auctionId, msg.sender, msg.value, block.timestamp);
    }
    
    function endAuction(uint256 _auctionId) 
        external 
        auctionExists(_auctionId) 
        nonReentrant 
    {
        Auction storage auction = auctions[_auctionId];
        
        require(
            block.timestamp >= auction.endTime || msg.sender == auction.farmer,
            "Auction cannot be ended yet"
        );
        require(!auction.ended, "Auction already ended");
        
        auction.ended = true;
        
        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }
    
    function releaseFunds(uint256 _auctionId) 
        external 
        auctionExists(_auctionId) 
        nonReentrant 
    {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.ended, "Auction must be ended first");
        require(!auction.paid, "Funds already released");
        require(
            msg.sender == auction.farmer || msg.sender == auction.highestBidder,
            "Only farmer or winning bidder can release funds"
        );
        
        if (auction.highestBidder != address(0)) {
            auction.paid = true;
            
            uint256 platformFeeAmount = (auction.highestBid * platformFee) / 10000;
            uint256 farmerAmount = auction.highestBid - platformFeeAmount;
            
            // Transfer to farmer
            payable(auction.farmer).transfer(farmerAmount);
            
            // Transfer platform fee to owner
            payable(owner()).transfer(platformFeeAmount);
            
            // Update statistics
            farmers[auction.farmer].totalRevenue += farmerAmount;
            buyers[auction.highestBidder].totalSpent += auction.highestBid;
            
            emit PaymentReleased(_auctionId, auction.farmer, auction.highestBidder, auction.highestBid);
        }
    }
    
    // View functions
    function getAuction(uint256 _auctionId) 
        external 
        view 
        auctionExists(_auctionId) 
        returns (Auction memory) 
    {
        return auctions[_auctionId];
    }
    
    function getAuctionBids(uint256 _auctionId) 
        external 
        view 
        auctionExists(_auctionId) 
        returns (Bid[] memory) 
    {
        return auctionBids[_auctionId];
    }
    
    function getFarmerAuctions(address _farmer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return farmerAuctions[_farmer];
    }
    
    function getBuyerBids(address _buyer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return buyerBids[_buyer];
    }
    
    function getActiveAuctions() external view returns (uint256[] memory) {
        uint256[] memory activeAuctions = new uint256[](auctionCounter);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= auctionCounter; i++) {
            if (!auctions[i].ended && block.timestamp < auctions[i].endTime) {
                activeAuctions[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeAuctions[i];
        }
        
        return result;
    }
    
    // Admin functions
    function verifyFarmer(address _farmer) external onlyOwner {
        require(bytes(farmers[_farmer].name).length > 0, "Farmer not registered");
        farmers[_farmer].verified = true;
    }
    
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        platformFee = _fee;
    }
    
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
