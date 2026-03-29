import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import {
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  IndianRupee,
  Eye,
  Users,
  Gavel,
  Star,
  MapPin,
  Award,
  ArrowRight,
  Target,
  Activity,
  Heart,
  Timer,
  Trophy,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import moment from 'moment';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/buyers/dashboard');
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

  const { statistics, recentBids, recommendedAuctions, notifications } = dashboardData || {};

  const StatCard = ({ icon, title, value, subtitle, color = "blue", trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-1">
              <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const RecommendedAuctionCard = ({ auction }) => {
    const timeLeft = moment(auction.endTime).fromNow();
    const isEndingSoon = moment(auction.endTime).diff(moment(), 'hours') < 2;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 flex items-center">
              {auction.cropName}
              <Star className="w-4 h-4 text-yellow-500 ml-2" />
            </h4>
            <p className="text-sm text-gray-600">{auction.quantity} {auction.unit}</p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {auction.farmerInfo?.location}
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isEndingSoon ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isEndingSoon ? '🔥 Ending Soon' : '✅ Active'}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Bid:</span>
            <span className="font-semibold text-green-600">₹{auction.currentHighestBid?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ends:</span>
            <span className={`font-medium ${isEndingSoon ? 'text-red-600' : 'text-gray-900'}`}>
              {timeLeft}
            </span>
          </div>
        </div>

        <Link
          to={`/auction/${auction.id}`}
          className="btn btn-primary btn-sm w-full"
        >
          <Gavel className="w-4 h-4 mr-1" />
          View & Bid
        </Link>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getStatusConfig = () => {
      switch (activity.bidStatus) {
        case 'winning':
          return {
            icon: <Trophy className="w-4 h-4 text-green-600" />,
            color: 'text-green-600',
            bg: 'bg-green-50',
            label: 'Leading'
          };
        case 'outbid':
          return {
            icon: <AlertCircle className="w-4 h-4 text-orange-600" />,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            label: 'Outbid'
          };
        case 'won':
          return {
            icon: <CheckCircle className="w-4 h-4 text-blue-600" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            label: 'Won!'
          };
        default:
          return {
            icon: <Clock className="w-4 h-4 text-gray-600" />,
            color: 'text-gray-600',
            bg: 'bg-gray-50',
            label: 'Pending'
          };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <div className={`p-3 rounded-lg ${statusConfig.bg} border border-gray-200`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h5 className="font-medium text-gray-900">{activity.auctionInfo?.cropName}</h5>
            <p className="text-sm text-gray-600">Your bid: ₹{activity.amount?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{moment(activity.createdAt).fromNow()}</p>
          </div>
          <div className="flex items-center">
            {statusConfig.icon}
            <span className={`ml-1 text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
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
            Welcome back, {user?.name}! 🛒
          </h1>
          <p className="text-gray-600 mt-2">
            Discover fresh produce and place winning bids
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/auctions"
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Browse All Auctions
            </Link>
            <Link
              to="/buyer/my-bids"
              className="btn btn-outline btn-lg hover:shadow-md transition-all duration-200"
            >
              <Activity className="w-5 h-5 mr-2" />
              My Bid History
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Gavel className="w-6 h-6 text-blue-600" />}
            title="Total Bids"
            value={statistics?.totalBids || 0}
            subtitle="All time"
            color="blue"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-yellow-600" />}
            title="Active Bids"
            value={statistics?.activeAuctions || 0}
            subtitle="Currently bidding"
            color="yellow"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6 text-green-600" />}
            title="Auctions Won"
            value={statistics?.wonAuctions || 0}
            subtitle="Successful purchases"
            color="green"
            trend="+12% this month"
          />
          <StatCard
            icon={<IndianRupee className="w-6 h-6 text-purple-600" />}
            title="Total Spent"
            value={`₹${statistics?.totalSpent?.toLocaleString() || 0}`}
            subtitle="On fresh produce"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended Auctions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
                  </div>
                  <Link
                    to="/auctions"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Based on your interests: {user?.interestedCrops?.join(', ')}
                </p>
              </div>
              <div className="p-6">
                {recommendedAuctions && recommendedAuctions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendedAuctions.slice(0, 4).map((auction) => (
                      <RecommendedAuctionCard key={auction.id} auction={auction} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start bidding on auctions to get personalized recommendations
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
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              {recentBids && recentBids.length > 0 ? (
                <div className="space-y-3">
                  {recentBids.slice(0, 4).map((bid) => (
                    <ActivityItem key={bid.id} activity={bid} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No recent activity</p>
                  <Link
                    to="/auctions"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                  >
                    Start bidding →
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Bidding Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Bid early to show interest and track auction progress
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Check farmer verification badges for quality assurance
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <p className="text-sm text-gray-600">
                    Use location filters to find fresh, local produce
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Link
                  to="/notifications"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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

export default BuyerDashboard;
