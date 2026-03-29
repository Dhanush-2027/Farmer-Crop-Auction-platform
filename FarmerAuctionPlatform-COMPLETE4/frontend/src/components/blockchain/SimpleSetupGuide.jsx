import React from 'react';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SimpleSetupGuide = () => {
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        💰 How to Get Paid with Digital Money
      </h3>
      <p className="text-gray-600 mb-6">
        Follow these simple steps to receive instant payments from buyers around the world.
      </p>

      <div className="space-y-6">
        {/* Step 1: Install MetaMask */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900">Install Payment App</h4>
          </div>
          <p className="text-gray-600 mb-3">
            This free app helps you receive digital money payments safely on your phone or computer.
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            📱 Download Free App
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>

        {/* Step 2: Add Network */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900">Connect to Payment System</h4>
          </div>
          <p className="text-gray-600 mb-3">
            Add our payment system to your app using these simple settings:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment System Name
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="Localhost 8545"
                  readOnly
                  className="input flex-1 bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard('Localhost 8545', 'Payment system name')}
                  className="btn btn-outline btn-sm ml-2"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Server
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="http://127.0.0.1:8545"
                  readOnly
                  className="input flex-1 bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard('http://127.0.0.1:8545', 'RPC URL')}
                  className="btn btn-outline btn-sm ml-2"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                System Code
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="1337"
                  readOnly
                  className="input flex-1 bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard('1337', 'Chain ID')}
                  className="btn btn-outline btn-sm ml-2"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Money Type
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="ETH"
                  readOnly
                  className="input flex-1 bg-gray-50 text-sm"
                />
                <button
                  onClick={() => copyToClipboard('ETH', 'Currency symbol')}
                  className="btn btn-outline btn-sm ml-2"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Import Test Account */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900">Get Free Test Money</h4>
          </div>
          <p className="text-gray-600 mb-3">
            Use this special code to get ₹7,50,000 worth of test money for practice:
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Secret Code (Copy this and add to your payment app)
            </label>
            <div className="flex items-center">
              <input
                type="password"
                value="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
                readOnly
                className="input flex-1 bg-gray-50 text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'Private key')}
                className="btn btn-primary btn-sm ml-2"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
            <p className="text-sm text-green-800">
              <strong>How to add:</strong> Payment App → Account → Add Account → Paste secret code → Done!
            </p>
          </div>
        </div>

        {/* Step 4: Connect */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <h4 className="font-semibold text-gray-900">Start Receiving Payments</h4>
          </div>
          <p className="text-gray-600 mb-3">
            After completing the above steps, refresh this page and start receiving digital money payments.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-success btn-sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Refresh Page
          </button>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-6 p-4 bg-yellow-50 rounded border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Why Digital Money?</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Get paid instantly from anywhere in the world</li>
          <li>• No bank delays or high transfer fees</li>
          <li>• Safe and secure transactions</li>
          <li>• Your money, your control</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleSetupGuide;
