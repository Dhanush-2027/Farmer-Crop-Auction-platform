import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Clock, Users, Gavel, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';

const BlockchainAuctionCard = ({ auction, onBidPlaced }) => {
  const { contracts, account, isConnected, formatEther, parseEther } = useWeb3();
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    if (contracts.farmerAuction && auction.id) {
      loadAuctionData();
    }
  }, [contracts.farmerAuction, auction.id]);

  const loadAuctionData = async () => {
    try {
      const auctionInfo = await contracts.farmerAuction.getAuction(auction.id);
      const auctionBids = await contracts.farmerAuction.getAuctionBids(auction.id);
      
      setAuctionData({
        id: auctionInfo.id.toString(),
        farmer: auctionInfo.farmer,
        cropName: auctionInfo.cropName,
        quantity: auctionInfo.quantity.toString(),
        unit: auctionInfo.unit,
        minimumBid: formatEther(auctionInfo.minimumBid),
        startTime: new Date(Number(auctionInfo.startTime) * 1000),
        endTime: new Date(Number(auctionInfo.endTime) * 1000),
        highestBid: formatEther(auctionInfo.highestBid),
        highestBidder: auctionInfo.highestBidder,
        ended: auctionInfo.ended,
        paid: auctionInfo.paid
      });

      setBids(auctionBids.map(bid => ({
        bidder: bid.bidder,
        amount: formatEther(bid.amount),
        timestamp: new Date(Number(bid.timestamp) * 1000)
      })));
    } catch (error) {
      console.error('Error loading auction data:', error);
    }
  };

  const handlePlaceBid = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    if (auctionData && parseFloat(bidAmount) <= parseFloat(auctionData.highestBid)) {
      toast.error('Bid must be higher than current highest bid');
      return;
    }

    setIsPlacingBid(true);
    try {
      const tx = await contracts.farmerAuction.placeBid(auction.id, {
        value: parseEther(bidAmount)
      });

      toast.loading('Placing bid...', { id: 'bid-tx' });
      await tx.wait();
      
      toast.success('Bid placed successfully!', { id: 'bid-tx' });
      setBidAmount('');
      await loadAuctionData();
      
      if (onBidPlaced) {
        onBidPlaced(auction.id, bidAmount);
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid: ' + error.message, { id: 'bid-tx' });
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleEndAuction = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const tx = await contracts.farmerAuction.endAuction(auction.id);
      toast.loading('Ending auction...', { id: 'end-tx' });
      await tx.wait();
      
      toast.success('Auction ended successfully!', { id: 'end-tx' });
      await loadAuctionData();
    } catch (error) {
      console.error('Error ending auction:', error);
      toast.error('Failed to end auction: ' + error.message, { id: 'end-tx' });
    }
  };

  const handleReleaseFunds = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const tx = await contracts.farmerAuction.releaseFunds(auction.id);
      toast.loading('Releasing funds...', { id: 'release-tx' });
      await tx.wait();
      
      toast.success('Funds released successfully!', { id: 'release-tx' });
      await loadAuctionData();
    } catch (error) {
      console.error('Error releasing funds:', error);
      toast.error('Failed to release funds: ' + error.message, { id: 'release-tx' });
    }
  };

  if (!auctionData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isActive = !auctionData.ended && new Date() < auctionData.endTime;
  const isOwner = account && account.toLowerCase() === auctionData.farmer.toLowerCase();
  const timeLeft = moment(auctionData.endTime).fromNow();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{auctionData.cropName}</h3>
          <p className="text-sm text-gray-600">{auctionData.quantity} {auctionData.unit}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
            Blockchain Verified
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? '🟢 Active' : '🔴 Ended'}
          </span>
        </div>
      </div>

      {/* Bid Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Minimum Bid</p>
          <p className="text-lg font-bold text-gray-900">{auctionData.minimumBid} ETH</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Current Highest</p>
          <p className="text-lg font-bold text-green-700">
            {auctionData.highestBid === '0.0' ? 'No bids' : `${auctionData.highestBid} ETH`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          <span>{bids.length} bid{bids.length !== 1 ? 's' : ''}</span>
        </div>
        {isActive && (
          <div className="flex items-center text-orange-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>Ends {timeLeft}</span>
          </div>
        )}
      </div>

      {/* Bidding Section */}
      {isActive && !isOwner && isConnected && (
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              placeholder="Enter bid amount (ETH)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="input flex-1"
              disabled={isPlacingBid}
            />
            <button
              onClick={handlePlaceBid}
              disabled={isPlacingBid || !bidAmount}
              className="btn btn-primary"
            >
              {isPlacingBid ? 'Bidding...' : 'Place Bid'}
            </button>
          </div>
        </div>
      )}

      {/* Owner Actions */}
      {isOwner && (
        <div className="border-t pt-4">
          <div className="flex gap-2">
            {isActive && (
              <button
                onClick={handleEndAuction}
                className="btn btn-warning btn-sm"
              >
                End Auction
              </button>
            )}
            {auctionData.ended && !auctionData.paid && auctionData.highestBidder !== '0x0000000000000000000000000000000000000000' && (
              <button
                onClick={handleReleaseFunds}
                className="btn btn-success btn-sm"
              >
                Release Funds
              </button>
            )}
          </div>
        </div>
      )}

      {/* Blockchain Link */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Auction ID: #{auctionData.id}</span>
          <button className="flex items-center hover:text-blue-600">
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Explorer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockchainAuctionCard;
