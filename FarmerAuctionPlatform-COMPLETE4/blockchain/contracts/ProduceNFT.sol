// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ProduceNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    struct ProduceCertificate {
        uint256 tokenId;
        uint256 auctionId;
        address farmer;
        address buyer;
        string cropName;
        uint256 quantity;
        string unit;
        uint256 salePrice;
        uint256 harvestDate;
        uint256 saleDate;
        bool organic;
        string location;
        string ipfsMetadata;
    }
    
    mapping(uint256 => ProduceCertificate) public certificates;
    mapping(uint256 => uint256) public auctionToNFT; // auctionId => tokenId
    mapping(address => uint256[]) public farmerCertificates;
    mapping(address => uint256[]) public buyerCertificates;
    
    event CertificateIssued(
        uint256 indexed tokenId,
        uint256 indexed auctionId,
        address indexed farmer,
        address buyer,
        string cropName
    );
    
    constructor() ERC721("FarmerAuction Produce Certificate", "FAPC") {}
    
    function issueCertificate(
        uint256 _auctionId,
        address _farmer,
        address _buyer,
        string memory _cropName,
        uint256 _quantity,
        string memory _unit,
        uint256 _salePrice,
        uint256 _harvestDate,
        bool _organic,
        string memory _location,
        string memory _ipfsMetadata
    ) external onlyOwner returns (uint256) {
        require(_farmer != address(0), "Invalid farmer address");
        require(_buyer != address(0), "Invalid buyer address");
        require(auctionToNFT[_auctionId] == 0, "Certificate already issued for this auction");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Mint NFT to buyer
        _safeMint(_buyer, tokenId);
        _setTokenURI(tokenId, _ipfsMetadata);
        
        // Create certificate
        certificates[tokenId] = ProduceCertificate({
            tokenId: tokenId,
            auctionId: _auctionId,
            farmer: _farmer,
            buyer: _buyer,
            cropName: _cropName,
            quantity: _quantity,
            unit: _unit,
            salePrice: _salePrice,
            harvestDate: _harvestDate,
            saleDate: block.timestamp,
            organic: _organic,
            location: _location,
            ipfsMetadata: _ipfsMetadata
        });
        
        // Update mappings
        auctionToNFT[_auctionId] = tokenId;
        farmerCertificates[_farmer].push(tokenId);
        buyerCertificates[_buyer].push(tokenId);
        
        emit CertificateIssued(tokenId, _auctionId, _farmer, _buyer, _cropName);
        
        return tokenId;
    }
    
    function getCertificate(uint256 _tokenId) 
        external 
        view 
        returns (ProduceCertificate memory) 
    {
        require(_exists(_tokenId), "Certificate does not exist");
        return certificates[_tokenId];
    }
    
    function getFarmerCertificates(address _farmer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return farmerCertificates[_farmer];
    }
    
    function getBuyerCertificates(address _buyer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return buyerCertificates[_buyer];
    }
    
    function verifyCertificate(uint256 _tokenId) 
        external 
        view 
        returns (bool exists, address currentOwner, ProduceCertificate memory certificate) 
    {
        exists = _exists(_tokenId);
        if (exists) {
            currentOwner = ownerOf(_tokenId);
            certificate = certificates[_tokenId];
        }
    }
    
    function getAuctionCertificate(uint256 _auctionId) 
        external 
        view 
        returns (uint256 tokenId, bool exists) 
    {
        tokenId = auctionToNFT[_auctionId];
        exists = tokenId != 0;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
