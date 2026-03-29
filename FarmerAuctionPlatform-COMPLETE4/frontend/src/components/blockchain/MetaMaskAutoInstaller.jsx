import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, ExternalLink, Zap, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const MetaMaskAutoInstaller = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isMetaMaskDetected, setIsMetaMaskDetected] = useState(false);
  const [isNetworkAdded, setIsNetworkAdded] = useState(false);
  const [isAccountImported, setIsAccountImported] = useState(false);

  useEffect(() => {
    // Auto-detect MetaMask installation
    const checkMetaMask = setInterval(() => {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetaMaskDetected(true);
        setStep(2);
        clearInterval(checkMetaMask);
      }
    }, 2000);

    return () => clearInterval(checkMetaMask);
  }, []);

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
    toast.success('MetaMask download page opened! Install and return here.');
  };

  const addNetworkAutomatically = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x539', // 1337 in hex
            chainName: 'Localhost 8545',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['http://127.0.0.1:8545'],
          }],
        });
        setIsNetworkAdded(true);
        setStep(3);
        toast.success('Network added successfully!');
      } catch (error) {
        toast.error('Please add network manually');
      }
    }
  };

  const importTestAccount = async () => {
    // This will copy the private key and show instructions
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    
    try {
      await navigator.clipboard.writeText(privateKey);
      toast.success('Private key copied! Import it in MetaMask');
      setIsAccountImported(true);
      setStep(4);
    } catch (error) {
      toast.error('Failed to copy private key');
    }
  };

  const completeSetup = () => {
    toast.success('🎉 Blockchain setup complete! You can now trade with cryptocurrency.');
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 rounded-xl p-8 border border-purple-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Auto Blockchain Setup
        </h2>
        <p className="text-gray-600">
          Automated MetaMask installation and configuration
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step > stepNum 
                  ? 'bg-green-500 text-white' 
                  : step === stepNum
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
              </div>
              {stepNum < 4 && (
                <div className={`w-12 h-1 ${
                  step > stepNum ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Install MetaMask */}
        {step === 1 && (
          <div className="bg-white rounded-lg p-6 border border-orange-200 text-center">
            <div className="text-6xl mb-4">🦊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Install MetaMask Extension
            </h3>
            <p className="text-gray-600 mb-6">
              MetaMask is required for blockchain transactions
            </p>
            <button
              onClick={installMetaMask}
              className="btn btn-primary btn-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              🦊 Auto-Install MetaMask
              <ExternalLink className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Page will auto-detect when MetaMask is installed
            </p>
          </div>
        )}

        {/* Step 2: Add Network */}
        {step === 2 && (
          <div className="bg-white rounded-lg p-6 border border-blue-200 text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Add Blockchain Network
            </h3>
            <p className="text-gray-600 mb-6">
              Connect to the local blockchain network
            </p>
            <button
              onClick={addNetworkAutomatically}
              className="btn btn-primary btn-lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              🚀 Auto-Add Network
            </button>
          </div>
        )}

        {/* Step 3: Import Account */}
        {step === 3 && (
          <div className="bg-white rounded-lg p-6 border border-green-200 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Import Test Account
            </h3>
            <p className="text-gray-600 mb-6">
              Get 10,000 ETH for testing blockchain features
            </p>
            <button
              onClick={importTestAccount}
              className="btn btn-primary btn-lg"
            >
              💎 Auto-Import Account (10,000 ETH)
            </button>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                After clicking, go to MetaMask → Import Account → Paste the copied private key
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="bg-white rounded-lg p-6 border border-green-200 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Setup Complete!
            </h3>
            <p className="text-gray-600 mb-6">
              Your blockchain environment is ready for trading
            </p>
            <button
              onClick={completeSetup}
              className="btn btn-success btn-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              🚀 Start Blockchain Trading
            </button>
          </div>
        )}
      </div>

      {/* Network Details */}
      <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="font-bold text-gray-900 mb-4">📋 Network Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Network Name:</span>
            <span className="ml-2 text-gray-900">Localhost 8545</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">RPC URL:</span>
            <span className="ml-2 text-gray-900">http://127.0.0.1:8545</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Chain ID:</span>
            <span className="ml-2 text-gray-900">1337</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Currency:</span>
            <span className="ml-2 text-gray-900">ETH</span>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl mb-2">🔒</div>
          <div className="font-semibold text-blue-900">Secure</div>
          <div className="text-xs text-blue-700">Blockchain protected</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl mb-2">⚡</div>
          <div className="font-semibold text-green-900">Fast</div>
          <div className="text-xs text-green-700">Instant payments</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl mb-2">🌍</div>
          <div className="font-semibold text-purple-900">Global</div>
          <div className="text-xs text-purple-700">Worldwide access</div>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskAutoInstaller;
