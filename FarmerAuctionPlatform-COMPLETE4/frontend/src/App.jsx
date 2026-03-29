import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public Pages
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/auth/FarmerLogin';
import FarmerSignup from './pages/auth/FarmerSignup';
import BuyerLogin from './pages/auth/BuyerLogin';
import BuyerSignup from './pages/auth/BuyerSignup';
import AllAuctionsPage from './pages/AllAuctionsPage';
import LiveAuctionPage from './pages/LiveAuctionPage';
import BlockchainAuctionsPage from './pages/blockchain/BlockchainAuctionsPage';
import BlockchainCreateAuction from './components/blockchain/BlockchainCreateAuction';

// Protected Pages - Farmer
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import CreateAuctionPage from './pages/farmer/CreateAuctionPage';
import AuctionResultPage from './pages/farmer/AuctionResultPage';

// Protected Pages - Buyer
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import MyBidsPage from './pages/buyer/MyBidsPage';

// Shared Protected Pages
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredUserType && user?.userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    const dashboardPath = user?.userType === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auctions" element={<AllAuctionsPage />} />
          <Route path="/auction/:auctionId" element={<LiveAuctionPage />} />
          <Route path="/blockchain" element={<BlockchainAuctionsPage />} />
          <Route path="/blockchain/create-auction" element={<BlockchainCreateAuction />} />
          
          {/* Authentication Routes */}
          <Route path="/farmer/login" element={
            <PublicRoute>
              <FarmerLogin />
            </PublicRoute>
          } />
          <Route path="/farmer/signup" element={
            <PublicRoute>
              <FarmerSignup />
            </PublicRoute>
          } />
          <Route path="/buyer/login" element={
            <PublicRoute>
              <BuyerLogin />
            </PublicRoute>
          } />
          <Route path="/buyer/signup" element={
            <PublicRoute>
              <BuyerSignup />
            </PublicRoute>
          } />

          {/* Farmer Protected Routes */}
          <Route path="/farmer/dashboard" element={
            <ProtectedRoute requiredUserType="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/create-auction" element={
            <ProtectedRoute requiredUserType="farmer">
              <CreateAuctionPage />
            </ProtectedRoute>
          } />
          <Route path="/farmer/auction/:auctionId/result" element={
            <ProtectedRoute requiredUserType="farmer">
              <AuctionResultPage />
            </ProtectedRoute>
          } />

          {/* Buyer Protected Routes */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute requiredUserType="buyer">
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer/my-bids" element={
            <ProtectedRoute requiredUserType="buyer">
              <MyBidsPage />
            </ProtectedRoute>
          } />

          {/* Shared Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
