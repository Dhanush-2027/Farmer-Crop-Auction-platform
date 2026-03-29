import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Gavel,
  Eye,
  Navigation,
  Shield,
  Leaf,
  Award,
  Timer
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import moment from 'moment';

const AllAuctionsPage = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    crop: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'endTime',
    radius: '',
    location: '',
    verifiedOnly: false,
    organicOnly: false
  });

  useEffect(() => {
    fetchAuctions();
  }, [filters]);

  const fetchAuctions = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/auctions?${params}`);
      setAuctions(response.data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      crop: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'endTime',
      radius: '',
      location: '',
      verifiedOnly: false,
      organicOnly: false
    });
  };

  // Countdown Timer Component
  const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
      const timer = setInterval(() => {
        const now = moment();
        const end = moment(endTime);
        const duration = moment.duration(end.diff(now));

        if (duration.asMilliseconds() <= 0) {
          setTimeLeft('Ended');
          clearInterval(timer);
          return;
        }

        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        let timeString = '';
        if (days > 0) {
          timeString = `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          timeString = `${hours}h ${minutes}m`;
        } else {
          timeString = `${minutes}m ${seconds}s`;
        }

        setTimeLeft(timeString);
        setIsUrgent(duration.asHours() < 2);
      }, 1000);

      return () => clearInterval(timer);
    }, [endTime]);

    return (
      <div className={`flex items-center ${isUrgent ? 'text-red-600 animate-pulse' : 'text-orange-600'}`}>
        <Timer className="w-4 h-4 mr-1" />
        <span className="font-medium text-sm">
          {timeLeft === 'Ended' ? 'Ended' : `Ends in ${timeLeft}`}
        </span>
      </div>
    );
  };

  const AuctionCard = ({ auction }) => {
    const timeLeft = moment(auction.endTime).fromNow();
    const isEndingSoon = moment(auction.endTime).diff(moment(), 'hours') < 2;

    // Mock data for verification and organic status (in real app, this would come from API)
    const isVerified = Math.random() > 0.5; // 50% chance
    const isOrganic = Math.random() > 0.7; // 30% chance

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {auction.image && (
          <div className="h-48 bg-gray-200 relative">
            <img
              src={`http://localhost:3001${auction.image}`}
              alt={auction.cropName}
              className="w-full h-full object-cover"
            />
            {/* Verification and Organic Badges */}
            <div className="absolute top-2 left-2 flex gap-1">
              {isVerified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
              {isOrganic && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  Organic
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{auction.cropName}</h3>
                {isVerified && !auction.image && (
                  <Shield className="w-4 h-4 text-blue-600" title="Verified Farmer" />
                )}
                {isOrganic && !auction.image && (
                  <Leaf className="w-4 h-4 text-green-600" title="Organic Produce" />
                )}
              </div>
              <p className="text-sm text-gray-600">{auction.quantity} {auction.unit}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              isEndingSoon ? 'bg-red-100 text-red-800 border-red-200 animate-pulse' : 'bg-green-100 text-green-800 border-green-200'
            }`}>
              {isEndingSoon ? '🔥 Ending Soon!' : '✅ Active'}
            </span>
          </div>

          {auction.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {auction.description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Minimum Bid:</span>
              <span className="font-medium">₹{auction.minimumBid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Highest:</span>
              <span className="font-medium text-green-600">
                ₹{auction.currentHighestBid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Bids:</span>
              <span className="font-medium">{auction.bidCount}</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{auction.farmerInfo?.location}</span>
          </div>

          <div className="mb-4">
            <CountdownTimer endTime={auction.endTime} />
          </div>

          <div className="flex gap-2">
            <Link
              to={`/auction/${auction.id}`}
              className="btn btn-primary flex-1 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Gavel className="w-4 h-4 mr-1" />
              {isEndingSoon ? '🔥 Bid Now!' : 'View & Bid'}
            </Link>
            <Link
              to={`/auction/${auction.id}`}
              className="btn btn-outline px-3 hover:shadow-md transition-all duration-200"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading auctions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Auctions</h1>
          <p className="text-gray-600 mt-2">
            Browse and bid on fresh produce from verified farmers
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
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
                  value={filters.crop}
                  onChange={(e) => handleFilterChange('crop', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                className="input"
                placeholder="Enter state"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📍 Location
              </label>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Your location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radius (km)
              </label>
              <select
                className="input"
                value={filters.radius}
                onChange={(e) => handleFilterChange('radius', e.target.value)}
              >
                <option value="">Any distance</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
                <option value="100">Within 100 km</option>
                <option value="200">Within 200 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (₹)
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  className="input text-xs"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  className="input text-xs"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
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
                <option value="endTime">Ending Soon</option>
                <option value="price">Price: Low to High</option>
                <option value="latest">Latest First</option>
              </select>
            </div>
          </div>

          {/* Special Filters */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={filters.verifiedOnly}
                onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-1 text-blue-600" />
                Verified Farmers Only
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                checked={filters.organicOnly}
                onChange={(e) => handleFilterChange('organicOnly', e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <Leaf className="w-4 h-4 mr-1 text-green-600" />
                Organic Produce Only
              </span>
            </label>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              {auctions.length} auction{auctions.length !== 1 ? 's' : ''} found
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Auctions Grid */}
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new auctions.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAuctionsPage;
