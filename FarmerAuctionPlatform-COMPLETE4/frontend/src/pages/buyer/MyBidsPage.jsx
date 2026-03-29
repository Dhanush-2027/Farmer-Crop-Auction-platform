import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Trophy,
  Clock,
  AlertCircle,
  Eye,
  Gavel,
  IndianRupee,
  MapPin,
  User,
  ArrowUpRight,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  Timer,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import moment from 'moment';

const MyBidsPage = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all',
    sortBy: 'latest'
  });

  useEffect(() => {
    fetchMyBids();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bids, filters]);

  const fetchMyBids = async () => {
    try {
      console.log('Fetching bids for user:', user);
      console.log('Auth token:', localStorage.getItem('token'));

      const response = await axios.get('/api/bids/my-bids');
      console.log('Bids response:', response.data);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bids];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(bid => bid.bidStatus === filters.status);
    }

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(bid =>
        bid.auctionInfo?.cropName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = moment();
      const days = filters.dateRange === 'week' ? 7 : filters.dateRange === 'month' ? 30 : 90;
      filtered = filtered.filter(bid =>
        moment(bid.createdAt).isAfter(now.subtract(days, 'days'))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'status':
          return a.bidStatus.localeCompare(b.bidStatus);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredBids(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'winning':
        return {
          icon: <Trophy className="w-4 h-4" />,
          color: 'text-green-600',
          bg: 'bg-green-100',
          border: 'border-green-200',
          label: 'Leading'
        };
      case 'outbid':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          border: 'border-orange-200',
          label: 'Outbid'
        };
      case 'won':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          border: 'border-blue-200',
          label: 'Won!'
        };
      case 'lost':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600',
          bg: 'bg-red-100',
          border: 'border-red-200',
          label: 'Lost'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          label: 'Pending'
        };
    }
  };

  // Calculate statistics
  const stats = {
    total: bids.length,
    active: bids.filter(bid => bid.bidStatus === 'winning').length,
    won: bids.filter(bid => bid.bidStatus === 'won').length,
    totalSpent: bids.filter(bid => bid.bidStatus === 'won').reduce((sum, bid) => sum + bid.amount, 0),
    successRate: bids.length > 0 ? Math.round((bids.filter(bid => bid.bidStatus === 'won').length / bids.length) * 100) : 0
  };

  if (loading) {
    return <LoadingSpinner text="Loading your bids..." />;
  }

  const StatCard = ({ icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const BidCard = ({ bid }) => {
    const statusConfig = getStatusConfig(bid.bidStatus);
    const auction = bid.auctionInfo;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{auction?.cropName}</h3>
            <p className="text-sm text-gray-600">{auction?.quantity} {auction?.unit}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <User className="w-3 h-3 mr-1" />
              <span>Farmer from {auction?.farmerLocation || 'Unknown'}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} flex items-center gap-1`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Your Bid</p>
            <p className="text-lg font-bold text-gray-900">₹{bid.amount?.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Current Highest</p>
            <p className="text-lg font-bold text-green-600">₹{auction?.currentHighestBid?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>Bid placed: {moment(bid.createdAt).fromNow()}</span>
          {auction?.status === 'active' && (
            <span className="flex items-center text-orange-600">
              <Timer className="w-3 h-3 mr-1" />
              Ends {moment(auction.endTime).fromNow()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/auction/${bid.auctionId}`}
            className="btn btn-outline btn-sm flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Auction
          </Link>
          {bid.bidStatus === 'outbid' && auction?.status === 'active' && (
            <Link
              to={`/auction/${bid.auctionId}`}
              className="btn btn-primary btn-sm flex-1"
            >
              <Gavel className="w-4 h-4 mr-1" />
              Bid Again
            </Link>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bids</h1>
          <p className="text-gray-600 mt-2">
            Track all your bids and auction participation
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<Gavel className="w-6 h-6 text-blue-600" />}
            title="Total Bids"
            value={stats.total}
            subtitle="All time"
            color="blue"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6 text-green-600" />}
            title="Leading"
            value={stats.active}
            subtitle="Currently winning"
            color="green"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-purple-600" />}
            title="Won"
            value={stats.won}
            subtitle="Successful bids"
            color="purple"
          />
          <StatCard
            icon={<IndianRupee className="w-6 h-6 text-orange-600" />}
            title="Total Spent"
            value={`₹${stats.totalSpent.toLocaleString()}`}
            subtitle="On won auctions"
            color="orange"
          />
          <StatCard
            icon={<Target className="w-6 h-6 text-red-600" />}
            title="Success Rate"
            value={`${stats.successRate}%`}
            subtitle="Win percentage"
            color="red"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Bids</option>
                <option value="winning">Leading</option>
                <option value="outbid">Outbid</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Crop
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search crops..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                className="input"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                className="input"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="amount">Highest Amount</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              {filteredBids.length} bid{filteredBids.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={fetchMyBids}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Bids Grid */}
        {filteredBids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBids.map((bid) => (
              <BidCard key={bid.id} bid={bid} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {filters.status === 'all' ? 'No bids yet' : `No ${filters.status} bids found`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.status === 'all'
                ? 'Start bidding on auctions to see your bid history here.'
                : 'Try adjusting your filters or browse more auctions.'
              }
            </p>
            <Link
              to="/auctions"
              className="btn btn-primary"
            >
              Browse Auctions
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBidsPage;
