import React, { useState, useEffect } from 'react';
import { Download, Copy, Wallet, CheckCircle, ExternalLink, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const InstantSetup = () => {
  const [setupStep, setSetupStep] = useState(1);
  const [isMetaMaskDetected, setIsMetaMaskDetected] = useState(false);

  useEffect(() => {
    // Check for MetaMask every 2 seconds
    const checkMetaMask = setInterval(() => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskDetected(true);
        setSetupStep(2);
        clearInterval(checkMetaMask);
      }
    }, 2000);

    return () => clearInterval(checkMetaMask);
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied! Paste in MetaMask`);
  };

  const openMetaMaskDownload = () => {
    window.open('https://metamask.io/download/', '_blank');
    toast.success('MetaMask download opened! Install and return here');
  };

  const addNetworkAutomatically = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x539',
            chainName: 'Localhost 8545',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
          }],
        });
        toast.success('Network added automatically!');
        setSetupStep(3);
      } catch (error) {
        toast.error('Please add network manually with the details below');
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-xl p-8 border border-blue-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ⚡ Instant Blockchain Setup
        </h2>
        <p className="text-gray-600 text-lg">
          Get started with blockchain trading in under 2 minutes!
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                setupStep >= step 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {setupStep > step ? <CheckCircle className="w-6 h-6" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 ${
                  setupStep > step ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Install MetaMask */}
      {setupStep === 1 && (
        <div className="bg-white rounded-lg p-6 border border-orange-200">
          <div className="text-center">
            <div className="text-6xl mb-4">🦊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Step 1: Install MetaMask
            </h3>
            <p className="text-gray-600 mb-6">
              MetaMask is your gateway to the blockchain. Install it to continue.
            </p>
            <button
              onClick={openMetaMaskDownload}
              className="btn btn-primary btn-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              🦊 Install MetaMask Now
              <ExternalLink className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              After installation, this page will automatically detect MetaMask
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Add Network */}
      {setupStep === 2 && (
        <div className="bg-white rounded-lg p-6 border border-blue-200">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🌐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Step 2: Add Blockchain Network
            </h3>
            <p className="text-gray-600 mb-6">
              Add the local blockchain network to MetaMask
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={addNetworkAutomatically}
              className="btn btn-primary btn-lg w-full"
            >
              <Wallet className="w-5 h-5 mr-2" />
              🚀 Add Network Automatically
            </button>

            <div className="text-center text-gray-500">
              <span>or add manually with these details:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network Name
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value="Localhost 8545"
                    readOnly
                    className="input flex-1 bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard('Localhost 8545', 'Network name')}
                    className="btn btn-outline btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RPC URL
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value="http://127.0.0.1:8545"
                    readOnly
                    className="input flex-1 bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard('http://127.0.0.1:8545', 'RPC URL')}
                    className="btn btn-outline btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chain ID
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value="1337"
                    readOnly
                    className="input flex-1 bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard('1337', 'Chain ID')}
                    className="btn btn-outline btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency Symbol
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value="ETH"
                    readOnly
                    className="input flex-1 bg-white"
                  />
                  <button
                    onClick={() => copyToClipboard('ETH', 'Currency symbol')}
                    className="btn btn-outline btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSetupStep(3)}
              className="btn btn-success w-full"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Network Added - Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Import Test Account */}
      {setupStep >= 3 && (
        <div className="bg-white rounded-lg p-6 border border-green-200">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Step 3: Import Test Account
            </h3>
            <p className="text-gray-600 mb-6">
              Import a test account with 10,000 ETH for blockchain trading
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-bold text-gray-900 mb-4 text-center">
              🎁 Free Test Account (10,000 ETH)
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Address
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    readOnly
                    className="input flex-1 bg-white text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Address')}
                    className="btn btn-outline btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Private Key (Import this in MetaMask)
                </label>
                <div className="flex items-center">
                  <input
                    type="password"
                    value="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
                    readOnly
                    className="input flex-1 bg-white text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'Private key')}
                    className="btn btn-primary btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Key
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-900 mb-2">📝 How to Import:</h5>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Open MetaMask extension</li>
                <li>2. Click account icon → "Import Account"</li>
                <li>3. Paste the private key above</li>
                <li>4. Click "Import"</li>
                <li>5. You'll see 10,000 ETH balance! 🎉</li>
              </ol>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-success btn-lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              🚀 Setup Complete - Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Benefits Section */}
      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
          🌟 Why Blockchain Trading?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">🔒</div>
            <h5 className="font-semibold text-blue-900">Secure</h5>
            <p className="text-sm text-blue-700">Immutable blockchain records</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <h5 className="font-semibold text-green-900">Fast</h5>
            <p className="text-sm text-green-700">Instant cryptocurrency payments</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🌍</div>
            <h5 className="font-semibold text-purple-900">Global</h5>
            <p className="text-sm text-purple-700">Trade with anyone, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantSetup;
