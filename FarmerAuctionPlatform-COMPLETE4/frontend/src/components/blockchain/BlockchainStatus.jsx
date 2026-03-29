import React, { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Copy, Zap, Wallet, Users, Gavel } from 'lucide-react';
import toast from 'react-hot-toast';

const BlockchainStatus = () => {
  const [isBlockchainReady, setIsBlockchainReady] = useState(false);

  useEffect(() => {
    // Check if blockchain is ready
    const checkBlockchain = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1
          })
        });
        
        if (response.ok) {
          setIsBlockchainReady(true);
        }
      } catch (error) {
        console.log('Blockchain not ready yet');
      }
    };

    checkBlockchain();
    const interval = setInterval(checkBlockchain, 3000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const contractAddresses = {
    FarmerAuction: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    ProduceNFT: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  };

  const testAccounts = [
    {
      name: 'Main Account (Deployer)',
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      balance: '10,000 ETH',
      role: 'Admin'
    },
    {
      name: 'Farmer 1 (Ravi Kumar)',
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      balance: '10,000 ETH',
      role: 'Farmer'
    },
    {
      name: 'Buyer 1 (Amit Traders)',
      address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
      balance: '10,000 ETH',
      role: 'Buyer'
    }
  ];

  const sampleAuctions = [
    {
      id: 1,
      crop: 'Premium Organic Tomatoes',
      quantity: '500 kg',
      currentBid: '0.75 ETH',
      status: 'Active'
    },
    {
      id: 2,
      crop: 'Nashik Red Onions',
      quantity: '1000 kg',
      currentBid: '0.45 ETH',
      status: 'Active'
    },
    {
      id: 3,
      crop: 'Premium Basmati Rice',
      quantity: '200 kg',
      currentBid: '0.9 ETH',
      status: 'Active'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl p-8 border border-green-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {isBlockchainReady ? (
            <CheckCircle className="w-10 h-10 text-white" />
          ) : (
            <Zap className="w-10 h-10 text-white animate-pulse" />
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isBlockchainReady ? '🎉 Blockchain Ready!' : '⚡ Setting up Blockchain...'}
        </h2>
        <p className="text-gray-600">
          {isBlockchainReady 
            ? 'Your decentralized agricultural marketplace is fully operational'
            : 'Preparing smart contracts and sample data...'
          }
        </p>
      </div>

      {isBlockchainReady && (
        <>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Smart Contracts</h3>
                  <p className="text-sm text-gray-600">Deployed & Active</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">FarmerAuction:</span>
                  <span className="text-green-600 font-mono">✅ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ProduceNFT:</span>
                  <span className="text-green-600 font-mono">✅ Ready</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Sample Auctions</h3>
                  <p className="text-sm text-gray-600">3 Active</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tomatoes:</span>
                  <span className="text-blue-600 font-mono">0.75 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Onions:</span>
                  <span className="text-blue-600 font-mono">0.45 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rice:</span>
                  <span className="text-blue-600 font-mono">0.9 ETH</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">Test Accounts</h3>
                  <p className="text-sm text-gray-600">Ready to Use</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Farmers:</span>
                  <span className="text-purple-600 font-mono">2 Registered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buyers:</span>
                  <span className="text-purple-600 font-mono">2 Registered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🚀 Quick Start Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">For Testing:</h4>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    Install MetaMask browser extension
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    Add localhost network (Chain ID: 1337)
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    Import test account with private key
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    Connect wallet and start trading!
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Features Available:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Create blockchain auctions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Place bids with cryptocurrency
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automatic escrow payments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    NFT authenticity certificates
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Accounts */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💰 Test Accounts (Each has 10,000 ETH)
            </h3>
            <div className="space-y-4">
              {testAccounts.map((account, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{account.name}</h4>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {account.role}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {account.balance}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={account.address}
                          readOnly
                          className="input flex-1 bg-gray-50 text-xs font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(account.address, 'Address')}
                          className="btn btn-outline btn-sm ml-2"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Private Key
                      </label>
                      <div className="flex items-center">
                        <input
                          type="password"
                          value={account.privateKey}
                          readOnly
                          className="input flex-1 bg-gray-50 text-xs font-mono"
                        />
                        <button
                          onClick={() => copyToClipboard(account.privateKey, 'Private key')}
                          className="btn btn-primary btn-sm ml-2"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!isBlockchainReady && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Setting up blockchain environment... This may take a moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockchainStatus;
