import React, { useState, useEffect } from 'react';
import { CheckCircle, Copy, ExternalLink, Wallet, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const AutoSetupGuide = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const networkConfig = {
    chainId: '0x539', // 1337 in hex
    chainName: 'Localhost 8545',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: null,
  };

  const testAccounts = [
    {
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      balance: '10,000 ETH'
    },
    {
      address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      balance: '10,000 ETH'
    }
  ];

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const addNetworkToMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        toast.success('Network added to MetaMask!');
        markStepComplete(3);
      } catch (error) {
        toast.error('Failed to add network: ' + error.message);
      }
    } else {
      toast.error('MetaMask not detected. Please install MetaMask first.');
    }
  };

  const markStepComplete = (step) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const isStepComplete = (step) => completedSteps.includes(step);

  useEffect(() => {
    // Auto-detect MetaMask installation
    if (typeof window.ethereum !== 'undefined') {
      markStepComplete(1);
      setCurrentStep(2);
    }
  }, []);

  const steps = [
    {
      id: 1,
      title: '🦊 Install MetaMask',
      description: 'Download and install the MetaMask browser extension',
      action: (
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          onClick={() => markStepComplete(1)}
        >
          <Download className="w-4 h-4 mr-2" />
          Install MetaMask
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      )
    },
    {
      id: 2,
      title: '🔧 Setup Wallet',
      description: 'Create a new wallet or import existing one in MetaMask',
      action: (
        <button
          onClick={() => markStepComplete(2)}
          className="btn btn-success"
          disabled={!isStepComplete(1)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Wallet Setup Complete
        </button>
      )
    },
    {
      id: 3,
      title: '🌐 Add Local Network',
      description: 'Add the localhost blockchain network to MetaMask',
      action: (
        <button
          onClick={addNetworkToMetaMask}
          className="btn btn-primary"
          disabled={!isStepComplete(2)}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Add Network Automatically
        </button>
      )
    },
    {
      id: 4,
      title: '💰 Import Test Account',
      description: 'Import a test account with 10,000 ETH for testing',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Click to copy private key, then import in MetaMask:</p>
          <button
            onClick={() => copyToClipboard(testAccounts[0].privateKey, 'Private key')}
            className="btn btn-outline btn-sm w-full"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Test Account Private Key
          </button>
          <button
            onClick={() => markStepComplete(4)}
            className="btn btn-success btn-sm w-full"
            disabled={!isStepComplete(3)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Account Imported
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Automatic Blockchain Setup
        </h2>
        <p className="text-gray-600">
          Follow these steps to set up MetaMask and start using blockchain features
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm font-medium text-gray-700">
            {completedSteps.length}/4 Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSteps.length / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Setup Steps */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`border rounded-lg p-6 transition-all ${
              isStepComplete(step.id)
                ? 'bg-green-50 border-green-200'
                : currentStep === step.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {isStepComplete(step.id) ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{step.id}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 ml-9">{step.description}</p>
              </div>
              <div className="ml-4">
                {step.action}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Network Configuration */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Network Configuration Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Network Name</label>
            <div className="flex items-center">
              <input
                type="text"
                value={networkConfig.chainName}
                readOnly
                className="input flex-1 bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(networkConfig.chainName, 'Network name')}
                className="btn btn-outline btn-sm ml-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RPC URL</label>
            <div className="flex items-center">
              <input
                type="text"
                value={networkConfig.rpcUrls[0]}
                readOnly
                className="input flex-1 bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(networkConfig.rpcUrls[0], 'RPC URL')}
                className="btn btn-outline btn-sm ml-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chain ID</label>
            <div className="flex items-center">
              <input
                type="text"
                value="1337"
                readOnly
                className="input flex-1 bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard('1337', 'Chain ID')}
                className="btn btn-outline btn-sm ml-2"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
            <div className="flex items-center">
              <input
                type="text"
                value="ETH"
                readOnly
                className="input flex-1 bg-gray-50"
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
      </div>

      {/* Test Accounts */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💰 Test Accounts (Each has 10,000 ETH)
        </h3>
        <div className="space-y-4">
          {testAccounts.map((account, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Account #{index + 1}</h4>
                <span className="text-sm text-green-600 font-medium">{account.balance}</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={account.address}
                      readOnly
                      className="input flex-1 bg-gray-50 text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(account.address, 'Address')}
                      className="btn btn-outline btn-sm ml-2"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Private Key</label>
                  <div className="flex items-center">
                    <input
                      type="password"
                      value={account.privateKey}
                      readOnly
                      className="input flex-1 bg-gray-50 text-xs"
                    />
                    <button
                      onClick={() => copyToClipboard(account.privateKey, 'Private key')}
                      className="btn btn-outline btn-sm ml-2"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {completedSteps.length === 4 && (
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Setup Complete!
          </h3>
          <p className="text-gray-600 mb-4">
            Your blockchain environment is ready. You can now connect your wallet and start trading!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet & Start Trading
          </button>
        </div>
      )}
    </div>
  );
};

export default AutoSetupGuide;
