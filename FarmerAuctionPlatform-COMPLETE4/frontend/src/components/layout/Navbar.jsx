import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Bell, 
  Gavel,
  Sprout,
  ShoppingCart,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isFarmer, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  const NavLink = ({ to, children, className = "" }) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActivePath(to)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
      } ${className}`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                FarmerAuction
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/auctions">
              <Gavel className="w-4 h-4 inline mr-1" />
              All Auctions
            </NavLink>

            <NavLink to="/blockchain">
              💰 Digital Money
            </NavLink>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/farmer/login"
                  className="btn btn-outline btn-sm"
                >
                  Farmer Login
                </Link>
                <Link
                  to="/buyer/login"
                  className="btn btn-primary btn-sm"
                >
                  Buyer Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Dashboard Link */}
                <NavLink 
                  to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}
                >
                  Dashboard
                </NavLink>

                {/* Farmer specific links */}
                {isFarmer && (
                  <NavLink to="/farmer/create-auction">
                    Create Auction
                  </NavLink>
                )}

                {/* Buyer specific links */}
                {isBuyer && (
                  <NavLink to="/buyer/my-bids">
                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                    My Bids
                  </NavLink>
                )}

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification badge - you can add logic to show unread count */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <NavLink to="/auctions">All Auctions</NavLink>
              <NavLink to="/blockchain">💰 Digital Money</NavLink>
              
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link
                    to="/farmer/login"
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Farmer Login
                  </Link>
                  <Link
                    to="/buyer/login"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Buyer Login
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <NavLink to={isFarmer ? '/farmer/dashboard' : '/buyer/dashboard'}>
                    Dashboard
                  </NavLink>
                  
                  {isFarmer && (
                    <NavLink to="/farmer/create-auction">Create Auction</NavLink>
                  )}
                  
                  {isBuyer && (
                    <NavLink to="/buyer/my-bids">My Bids</NavLink>
                  )}
                  
                  <NavLink to="/notifications">Notifications</NavLink>
                  <NavLink to="/profile">Profile Settings</NavLink>
                  
                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
