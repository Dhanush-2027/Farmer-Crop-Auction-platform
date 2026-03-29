import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  IndianRupee,
  Eye,
  Users,
  Gavel,
  ArrowUp,
  ArrowDown,
  Minus,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import moment from 'moment';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/farmers/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  const { statistics, recentAuctions, notifications } = dashboardData || {};

  // Realistic market trends data based on Indian agricultural markets (₹ per kg)
  const marketTrends = [
    { crop: 'Tomato', price: 28, change: 12, trend: 'up' },
    { crop: 'Onion', price: 22, change: -8, trend: 'down' },
    { crop: 'Wheat', price: 24, change: 3, trend: 'up' },
    { crop: 'Rice', price: 32, change: 5, trend: 'up' },
    { crop: 'Potato', price: 18, change: -2, trend: 'down' }
  ];

  const StatCard = ({ icon, title, value, subtitle, color = "primary" }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

  const AuctionCard = ({ auction }) => {
    const timeLeft = moment(auction.endTime).fromNow();
    const isActive = auction.status === 'active';
    const isEnded = auction.status === 'ended';
    const isCompleted = auction.status === 'completed';
    const isExpired = auction.status === 'expired';

    const getStatusConfig = () => {
      if (isActive) return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '🟡',
        label: 'Active'
      };
      if (isCompleted) return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '🟢',
        label: 'Sold'
      };
      if (isExpired || isEnded) return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '🔴',
        label: 'Expired'
      };
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '⚪',
        label: auction.status
      };
    };

    const statusConfig = getStatusConfig();

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{auction.cropName}</h3>
            <p className="text-sm text-gray-600">{auction.quantity} {auction.unit}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} flex items-center gap-1`}>
            <span>{statusConfig.icon}</span>
            {statusConfig.label}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Minimum Bid:</span>
            <span className="font-semibold text-gray-900">₹{auction.minimumBid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span className="text-sm text-gray-600">Current Highest:</span>
            <span className="font-bold text-green-700">₹{(auction.currentHighestBid || auction.minimumBid).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Bids:</span>
            <span className="font-medium text-blue-600">{auction.bidCount || 0} bids</span>
          </div>
          {isActive && (
            <div className="flex justify-between items-center p-2 bg-yellow-50 rounded border border-yellow-200">
              <span className="text-sm text-gray-600">⏰ Ends:</span>
              <span className="font-medium text-orange-600">{timeLeft}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/farmer/auction/${auction.id}/result`}
            className="btn btn-outline btn-sm flex-1 hover:shadow-md transition-all duration-200"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </Link>
          {(isEnded || isCompleted) && (
            <Link
              to={`/farmer/auction/${auction.id}/result`}
              className="btn btn-primary btn-sm flex-1 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isCompleted ? '✅ Sold' : '📋 Review Bids'}
            </Link>
          )}
          {isActive && auction.bidCount > 0 && (
            <div className="flex-1 text-center">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                🔥 {auction.bidCount} active bid{auction.bidCount !== 1 ? 's' : ''}
              </span>
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👨‍🌾
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your auctions and track your sales performance
          </p>

          {/* Profile Completion */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Profile 80% complete</p>
                <p className="text-xs text-blue-700">Add bank details to receive payments faster</p>
              </div>
              <Link
                to="/profile"
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/farmer/create-auction"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              + New Auction
            </Link>
            <Link
              to="/farmer/auctions"
              className="btn btn-outline btn-lg hover:shadow-md transition-all duration-200"
            >
              <Gavel className="w-5 h-5 mr-2" />
              View All Auctions
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Gavel className="w-6 h-6 text-primary-600" />}
            title="Total Auctions"
            value={statistics?.totalAuctions || 0}
            subtitle="All time"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            title="Active Auctions"
            value={statistics?.activeAuctions || 0}
            subtitle="Currently running"
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6 text-green-600" />}
            title="Completed Sales"
            value={statistics?.completedAuctions || 0}
            subtitle="Successfully sold"
            color="green"
          />
          <StatCard
            icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
            title="Total Revenue"
            value={`₹${statistics?.totalRevenue?.toLocaleString() || 0}`}
            subtitle="From all sales"
            color="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Auctions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Auctions</h2>
                  <Link
                    to="/farmer/auctions"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentAuctions && recentAuctions.length > 0 ? (
                  <div className="space-y-4">
                    {recentAuctions.slice(0, 3).map((auction) => (
                      <AuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create your first auction to start selling your crops
                    </p>
                    <Link
                      to="/farmer/create-auction"
                      className="btn btn-primary"
                    >
                      Create Auction
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications & Quick Stats */}
          <div className="space-y-6">
            {/* Market Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">📊 Market Trends</h3>
              </div>
              <div className="space-y-3">
                {marketTrends.slice(0, 3).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{trend.crop}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">₹{trend.price}/kg</span>
                      <div className="flex items-center">
                        {trend.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-600" />}
                        {trend.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-600" />}
                        {trend.trend === 'stable' && <Minus className="w-3 h-3 text-gray-600" />}
                        <span className={`text-xs font-medium ${
                          trend.trend === 'up' ? 'text-green-600' :
                          trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">Last updated: 10 mins ago</p>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Add clear photos to get better bids on your crops
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Set competitive minimum prices based on market rates
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Respond quickly to buyer inquiries for better sales
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                <Link
                  to="/notifications"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              {notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {moment(notification.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
