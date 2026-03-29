import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sprout, Eye, EyeOff, User, Phone, MapPin, Wheat } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FarmerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    state: '',
    district: '',
    crops: [],
    password: '',
    confirmPassword: '',
    language: 'en',
    userType: 'farmer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cropInput, setCropInput] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const commonCrops = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Jute', 'Tea', 'Coffee',
    'Coconut', 'Groundnut', 'Mustard', 'Sunflower', 'Soybean', 'Potato',
    'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Carrot',
    'Beans', 'Peas', 'Chili', 'Turmeric', 'Coriander', 'Cumin'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addCrop = (crop) => {
    if (crop && !formData.crops.includes(crop)) {
      setFormData({
        ...formData,
        crops: [...formData.crops, crop]
      });
    }
    setCropInput('');
  };

  const removeCrop = (cropToRemove) => {
    setFormData({
      ...formData,
      crops: formData.crops.filter(crop => crop !== cropToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.crops.length === 0) {
      toast.error('Please add at least one crop');
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/farmer/dashboard');
    }
    
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner text="Creating your account..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <Sprout className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Join as a Farmer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start selling your crops at fair prices
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input pl-10"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  className="input mt-1"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                  District
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"
                  required
                  className="input mt-1"
                  placeholder="Enter district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crops You Grow
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Type crop name or select from suggestions"
                    value={cropInput}
                    onChange={(e) => setCropInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCrop(cropInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addCrop(cropInput)}
                    className="btn btn-primary btn-sm"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {commonCrops.map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => addCrop(crop)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      {crop}
                    </button>
                  ))}
                </div>

                {formData.crops.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.crops.map(crop => (
                      <span
                        key={crop}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {crop}
                        <button
                          type="button"
                          onClick={() => removeCrop(crop)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pr-10"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="input pr-10"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>
              <select
                id="language"
                name="language"
                className="input mt-1"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg w-full"
              >
                {loading ? 'Creating Account...' : 'Create Farmer Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/farmer/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Looking to buy crops?{' '}
              <Link to="/buyer/signup" className="font-medium text-primary-600 hover:text-primary-500">
                Join as buyer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignup;
