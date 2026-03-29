import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Clock, 
  IndianRupee, 
  Users, 
  Gavel,
  MapPin,
  User,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import moment from 'moment';

const LiveAuctionPage = () => {
  const { auctionId } = useParams();
  const { user, isAuthenticated, isBuyer } = useAuth();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auctions/${auctionId}`);
      setAuction(response.data);
    } catch (error) {
      console.error('Error fetching auction details:', error);
      toast.error('Failed to load auction details');
      navigate('/auctions');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to place a bid');
      navigate('/buyer/login');
      return;
    }

    if (!isBuyer) {
      toast.error('Only buyers can place bids');
      return;
    }

    const amount = parseInt(bidAmount);
    if (amount <= auction.currentHighestBid) {
      toast.error(`Bid must be higher than ₹${auction.currentHighestBid}`);
      return;
    }

    setPlacingBid(true);

    try {
      const response = await axios.post('/api/bids', {
        auctionId: auction.id,
        amount: amount
      });

      toast.success('Bid placed successfully!');
      setBidAmount('');
      
      // Refresh auction details
      fetchAuctionDetails();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place bid';
      toast.error(message);
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading auction details..." />;
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction not found</h2>
          <p className="text-gray-600 mb-4">The auction you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/auctions')}
            className="btn btn-primary"
          >
            Browse Auctions
          </button>
        </div>
      </div>
    );
  }

  const timeLeft = moment(auction.endTime).fromNow();
  const isActive = auction.status === 'active';
  const isEndingSoon = moment(auction.endTime).diff(moment(), 'hours') < 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{auction.cropName}</h1>
                  <p className="text-lg text-gray-600">{auction.quantity} {auction.unit}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? (isEndingSoon ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800') :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {isActive ? (isEndingSoon ? 'Ending Soon!' : 'Active') : auction.status}
                </span>
              </div>

              {auction.image && (
                <div className="mb-6">
                  <img
                    src={`http://localhost:3001${auction.image}`}
                    alt={auction.cropName}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {auction.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{auction.description}</p>
                </div>
              )}

              {/* Farmer Info */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Farmer Information</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{auction.farmerInfo?.name}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{auction.farmerInfo?.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bids</h3>
              {auction.bids && auction.bids.length > 0 ? (
                <div className="space-y-3">
                  {auction.bids.slice(0, 5).map((bid, index) => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3 ${
                          index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{bid.buyerName}</p>
                          <p className="text-sm text-gray-600">{moment(bid.createdAt).fromNow()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">₹{bid.amount.toLocaleString()}</p>
                        {index === 0 && (
                          <p className="text-sm text-green-600">Highest Bid</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bids yet. Be the first to bid!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auction Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Bid:</span>
                  <span className="font-medium">₹{auction.minimumBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Highest:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ₹{auction.currentHighestBid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bids:</span>
                  <span className="font-medium">{auction.bidCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Left:</span>
                  <span className={`font-medium ${isEndingSoon ? 'text-red-600' : 'text-gray-900'}`}>
                    {timeLeft}
                  </span>
                </div>
              </div>
            </div>

            {/* Bidding Form */}
            {isActive && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Place Your Bid</h3>
                
                {!isAuthenticated ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Login to place a bid</p>
                    <button
                      onClick={() => navigate('/buyer/login')}
                      className="btn btn-primary w-full"
                    >
                      Login as Buyer
                    </button>
                  </div>
                ) : !isBuyer ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Only buyers can place bids</p>
                    <button
                      onClick={() => navigate('/buyer/signup')}
                      className="btn btn-primary w-full"
                    >
                      Register as Buyer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceBid}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Bid Amount (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IndianRupee className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          className="input pl-10"
                          placeholder={`Min: ₹${auction.currentHighestBid + 1}`}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          min={auction.currentHighestBid + 1}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Must be higher than ₹{auction.currentHighestBid.toLocaleString()}
                      </p>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={placingBid}
                      className="btn btn-primary w-full"
                    >
                      {placingBid ? 'Placing Bid...' : 'Place Bid'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/auctions')}
                  className="btn btn-outline w-full"
                >
                  Browse More Auctions
                </button>
                {isAuthenticated && isBuyer && (
                  <button
                    onClick={() => navigate('/buyer/my-bids')}
                    className="btn btn-outline w-full"
                  >
                    View My Bids
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAuctionPage;
