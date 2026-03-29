import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Upload, 
  IndianRupee, 
  Clock, 
  Package, 
  FileText,
  MapPin,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreateAuctionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    minimumBid: '',
    description: '',
    state: user?.state || '',
    district: user?.district || '',
    durationHours: '24',
    image: null
  });

  const commonCrops = [
    'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Jute', 'Tea', 'Coffee',
    'Coconut', 'Groundnut', 'Mustard', 'Sunflower', 'Soybean', 'Potato',
    'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower', 'Carrot',
    'Beans', 'Peas', 'Chili', 'Turmeric', 'Coriander', 'Cumin'
  ];

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'quintal', label: 'Quintals' },
    { value: 'ton', label: 'Tons' },
    { value: 'bag', label: 'Bags' },
    { value: 'box', label: 'Boxes' }
  ];

  const durationOptions = [
    { value: '6', label: '6 hours' },
    { value: '12', label: '12 hours' },
    { value: '24', label: '1 day' },
    { value: '48', label: '2 days' },
    { value: '72', label: '3 days' },
    { value: '168', label: '1 week' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axios.post('/api/auctions', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Auction created successfully!');
      navigate('/farmer/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create auction';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Creating your auction..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Auction</h1>
            <p className="text-gray-600 mt-2">
              List your crops for auction and get the best prices from verified buyers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Crop Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Crop Information
              </h2>

              <div>
                <label htmlFor="cropName" className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  id="cropName"
                  name="cropName"
                  required
                  list="crops"
                  className="input"
                  placeholder="Enter crop name"
                  value={formData.cropName}
                  onChange={handleChange}
                />
                <datalist id="crops">
                  {commonCrops.map(crop => (
                    <option key={crop} value={crop} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    className="input"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    required
                    className="input"
                    value={formData.unit}
                    onChange={handleChange}
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="input"
                  placeholder="Describe your crop quality, variety, etc."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="input"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    className="input"
                    placeholder="District"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Auction Settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Auction Settings
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minimumBid" className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Bid Price (₹) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="minimumBid"
                      name="minimumBid"
                      required
                      min="1"
                      className="input pl-10"
                      placeholder="Enter minimum bid"
                      value={formData.minimumBid}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="durationHours" className="block text-sm font-medium text-gray-700 mb-1">
                    Auction Duration *
                  </label>
                  <select
                    id="durationHours"
                    name="durationHours"
                    required
                    className="input"
                    value={formData.durationHours}
                    onChange={handleChange}
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Crop Image
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload crop image
                        </span>
                        <span className="mt-1 block text-sm text-gray-600">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1"
              >
                {loading ? 'Creating...' : 'Create Auction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
