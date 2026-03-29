import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import WalletConnect from '../../components/blockchain/WalletConnect';
import BlockchainAuctionCard from '../../components/blockchain/BlockchainAuctionCard';
import AutoSetupGuide from '../../components/blockchain/AutoSetupGuide';
import BlockchainStatus from '../../components/blockchain/BlockchainStatus';
import LiveTradingDemo from '../../components/blockchain/LiveTradingDemo';
import SimpleSetupGuide from '../../components/blockchain/SimpleSetupGuide';
import FarmerFriendlyGuide from '../../components/blockchain/FarmerFriendlyGuide';
import { Plus, Gavel, TrendingUp, Users, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const BlockchainAuctionsPage = () => {
  const { contracts, isConnected, account, balance, chainId } = useWeb3();
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAuctions: 0,
    activeAuctions: 0,
    totalVolume: '0',
    totalUsers: 0
  });

  // Load blockchain auctions
  const loadAuctions = async () => {
    try {
      setLoading(true);

      // Mock data for now - replace with actual smart contract calls
      const mockAuctions = [
        {
          id: 1,
          cropName: 'Premium Organic Tomatoes',
          quantity: '500',
          unit: 'kg',
          farmer: 'Ravi Kumar',
          currentBid: '0.75',
          minBid: '0.5',
          endTime: Date.now() + 86400000,
          bidCount: 3
        },
        {
          id: 2,
          cropName: 'Nashik Red Onions',
          quantity: '1000',
          unit: 'kg',
          farmer: 'Sita Devi',
          currentBid: '0.45',
          minBid: '0.3',
          endTime: Date.now() + 172800000,
          bidCount: 2
        }
      ];

      setAuctions(mockAuctions);
    } catch (error) {
      console.error('Error loading auctions:', error);
      toast.error('Failed to load blockchain auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && contracts.farmerAuction) {
      loadAuctions();
      loadStats();
    }
  }, [isConnected, contracts.farmerAuction]);

  const loadStats = async () => {
    try {
      // Mock stats for now - replace with actual smart contract calls
      setStats({
        totalAuctions: auctions.length,
        activeAuctions: auctions.length,
        totalVolume: auctions.reduce((sum, auction) => sum + parseFloat(auction.currentBid || 0), 0).toFixed(2),
        totalUsers: 4 // Mock value
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleBid = async (auctionId, bidAmount) => {
    try {
      // Place bid on blockchain
      toast.success(`Bid placed: ${bidAmount} ETH`);
      loadAuctions(); // Reload auctions
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              💰 Cryptocurrency Trading
            </h1>
            <p className="text-gray-600 mb-8">
              Sell your crops and get paid instantly with digital money from anywhere in the world
            </p>
          </div>

          <div className="mb-8">
            <WalletConnect />
          </div>

          <div className="mb-8">
            <FarmerFriendlyGuide />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                💰 Digital Money Trading
              </h1>
              <p className="text-gray-600 mt-2">
                Sell your crops and get paid instantly with digital money from buyers worldwide
              </p>
            </div>
            
            {user?.userType === 'farmer' && (
              <Link
                to="/blockchain/create-auction"
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                🌾 Sell My Crops for Digital Money
              </Link>
            )}
          </div>

          {/* Wallet Status */}
          <WalletConnect />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Gavel className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Crops for Sale</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAuctions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Now</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAuctions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Money Earned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVolume} ETH</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Balance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <BlockchainAuctionCard
                key={auction.id}
                auction={auction}
                onBidPlaced={handleBid}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Active Blockchain Auctions
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a blockchain auction and experience decentralized trading.
            </p>
            {user?.userType === 'farmer' && (
              <Link
                to="/blockchain/create-auction"
                className="btn btn-primary"
              >
                Create First Auction
              </Link>
            )}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Blockchain Auctions?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent & Secure</h3>
              <p className="text-gray-600">
                All transactions are recorded on the blockchain, ensuring complete transparency and security.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Payments</h3>
              <p className="text-gray-600">
                Smart contracts automatically handle payments, eliminating delays and intermediaries.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Access</h3>
              <p className="text-gray-600">
                Reach buyers worldwide without geographical restrictions or traditional banking limitations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainAuctionsPage;
