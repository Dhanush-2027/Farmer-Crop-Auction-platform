import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar, DollarSign, Package, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const BlockchainCreateAuction = () => {
  const { contracts, isConnected, account, parseEther } = useWeb3();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    minimumBid: '',
    duration: '24',
    description: '',
    image: null
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadToIPFS = async (file) => {
    // Simulate IPFS upload - in production, use actual IPFS service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`QmHash${Date.now()}`);
      }, 1000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!contracts.farmerAuction) {
      toast.error('Smart contract not initialized');
      return;
    }

    setIsCreating(true);
    
    try {
      // Upload image to IPFS (simulated)
      let ipfsHash = '';
      if (formData.image) {
        toast.loading('Uploading image to IPFS...', { id: 'ipfs' });
        ipfsHash = await uploadToIPFS(formData.image);
        toast.success('Image uploaded to IPFS', { id: 'ipfs' });
      }

      // Create metadata object
      const metadata = {
        name: formData.cropName,
        description: formData.description,
        image: ipfsHash,
        attributes: [
          { trait_type: "Quantity", value: `${formData.quantity} ${formData.unit}` },
          { trait_type: "Farmer", value: user?.name || 'Unknown' },
          { trait_type: "Location", value: user?.location || 'Unknown' }
        ]
      };

      // Convert duration to seconds
      const durationInSeconds = parseInt(formData.duration) * 3600; // hours to seconds

      // Create auction on blockchain
      toast.loading('Creating blockchain auction...', { id: 'auction' });
      
      const tx = await contracts.farmerAuction.createAuction(
        formData.cropName,
        parseInt(formData.quantity),
        formData.unit,
        parseEther(formData.minimumBid),
        durationInSeconds,
        JSON.stringify(metadata)
      );

      await tx.wait();
      
      toast.success('Blockchain auction created successfully!', { id: 'auction' });
      
      // Navigate back to blockchain auctions
      navigate('/blockchain');
      
    } catch (error) {
      console.error('Error creating auction:', error);
      toast.error('Failed to create auction: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wallet Connection Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your MetaMask wallet to create blockchain auctions
          </p>
          <button
            onClick={() => navigate('/blockchain')}
            className="btn btn-primary"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Create Blockchain Auction
          </h1>
          <p className="text-gray-600">
            Create a decentralized auction powered by smart contracts
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Crop Name *
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleInputChange}
                  placeholder="e.g., Premium Organic Tomatoes"
                  className="input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="input w-full"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="tons">Tons</option>
                    <option value="quintal">Quintal</option>
                    <option value="bags">Bags</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Auction Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Minimum Bid (ETH) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  name="minimumBid"
                  value={formData.minimumBid}
                  onChange={handleInputChange}
                  placeholder="0.5"
                  className="input w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Starting bid amount in Ethereum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Duration (Hours) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="6">6 Hours</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours (1 Day)</option>
                  <option value="48">48 Hours (2 Days)</option>
                  <option value="72">72 Hours (3 Days)</option>
                  <option value="168">1 Week</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your crop quality, farming methods, certifications, etc."
                className="input w-full"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Crop Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload crop image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="btn btn-outline cursor-pointer"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                🔗 Blockchain Features
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Immutable auction records on blockchain</li>
                <li>✅ Automatic escrow for secure payments</li>
                <li>✅ Transparent bidding history</li>
                <li>✅ NFT certificate for authenticity</li>
                <li>✅ Global accessibility with cryptocurrency</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/blockchain')}
                className="btn btn-outline"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="btn btn-primary"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Auction...
                  </>
                ) : (
                  <>
                    🚀 Create Blockchain Auction
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlockchainCreateAuction;
