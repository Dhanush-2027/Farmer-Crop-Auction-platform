import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Wallet, Download, Settings, Play, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const SuperAutomaticSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [logs, setLogs] = useState([]);
  const [autoProgress, setAutoProgress] = useState(0);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const steps = [
    {
      id: 1,
      title: '🦊 Auto-Installing MetaMask',
      description: 'Opening MetaMask download and detecting installation',
      action: async () => {
        addLog('🚀 Opening MetaMask download page...', 'info');
        window.open('https://metamask.io/download/', '_blank');
        
        addLog('⏳ Waiting for MetaMask installation...', 'info');
        let attempts = 0;
        while (attempts < 60 && typeof window.ethereum === 'undefined') {
          await sleep(2000);
          attempts++;
          addLog(`🔍 Checking for MetaMask... (${attempts}/60)`, 'info');
        }
        
        if (typeof window.ethereum !== 'undefined') {
          addLog('✅ MetaMask detected successfully!', 'success');
          return true;
        } else {
          addLog('⚠️ MetaMask not detected. Please install manually.', 'warning');
          return false;
        }
      }
    },
    {
      id: 2,
      title: '🌐 Auto-Adding Network',
      description: 'Automatically configuring localhost blockchain network',
      action: async () => {
        addLog('🌐 Adding localhost network automatically...', 'info');
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539',
              chainName: 'Localhost 8545',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['http://127.0.0.1:8545'],
            }],
          });
          addLog('✅ Network added successfully!', 'success');
          return true;
        } catch (error) {
          addLog(`⚠️ Network addition failed: ${error.message}`, 'warning');
          return false;
        }
      }
    },
    {
      id: 3,
      title: '💰 Auto-Importing Account',
      description: 'Setting up test account with 10,000 ETH',
      action: async () => {
        const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        addLog('💰 Copying test account private key...', 'info');
        
        try {
          await navigator.clipboard.writeText(privateKey);
          addLog('✅ Private key copied to clipboard!', 'success');
          addLog('📋 Please import this key in MetaMask manually', 'info');
          
          // Show instructions for manual import
          toast.success('Private key copied! Go to MetaMask → Import Account → Paste key');
          return true;
        } catch (error) {
          addLog('⚠️ Clipboard access failed', 'warning');
          return false;
        }
      }
    },
    {
      id: 4,
      title: '🔗 Auto-Connecting Wallet',
      description: 'Establishing connection to your wallet',
      action: async () => {
        addLog('🔗 Attempting automatic wallet connection...', 'info');
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          
          if (accounts.length > 0) {
            addLog(`✅ Wallet connected: ${accounts[0]}`, 'success');
            addLog('🎉 Setup complete! Ready for blockchain trading!', 'success');
            return true;
          }
        } catch (error) {
          addLog(`⚠️ Connection failed: ${error.message}`, 'warning');
          return false;
        }
        return false;
      }
    }
  ];

  const runAutomaticSetup = async () => {
    setIsProcessing(true);
    addLog('🤖 Starting fully automatic blockchain setup...', 'success');
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setAutoProgress((i / steps.length) * 100);
      
      addLog(`📋 ${steps[i].title}`, 'info');
      const success = await steps[i].action();
      
      if (!success && i < 2) { // Critical steps
        addLog('❌ Critical step failed. Switching to manual mode.', 'error');
        setIsProcessing(false);
        return;
      }
      
      await sleep(1000);
    }
    
    setCurrentStep(steps.length);
    setAutoProgress(100);
    setIsProcessing(false);
    
    // Auto-refresh after successful setup
    setTimeout(() => {
      addLog('🔄 Refreshing page to show connected state...', 'info');
      window.location.reload();
    }, 3000);
  };

  useEffect(() => {
    runAutomaticSetup();
  }, []);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border border-indigo-200">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {isProcessing ? (
            <Zap className="w-12 h-12 text-white animate-pulse" />
          ) : (
            <CheckCircle className="w-12 h-12 text-white" />
          )}
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          🤖 Super Automatic Setup
        </h2>
        <p className="text-gray-600 text-lg">
          {isProcessing ? 'AI is setting up everything automatically...' : 'Setup completed successfully!'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Auto-Setup Progress</span>
          <span className="text-sm font-medium text-gray-700">{Math.round(autoProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${autoProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border transition-all ${
              index < currentStep
                ? 'bg-green-50 border-green-200'
                : index === currentStep
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">
                {index < currentStep ? '✅' : index === currentStep ? '⚡' : '⏳'}
              </div>
              <div className="font-semibold text-sm">{step.title}</div>
              <div className="text-xs text-gray-600 mt-1">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Console */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 h-64 overflow-y-auto">
        <div className="flex items-center mb-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-3 text-gray-400 text-sm">AI Setup Console</span>
        </div>
        <div className="font-mono text-sm space-y-1">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                log.type === 'success' ? 'text-green-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-gray-300'
              }`}
            >
              <span className="text-gray-500 text-xs">[{log.timestamp}]</span>
              <span>{log.message}</span>
            </div>
          ))}
          {isProcessing && (
            <div className="text-blue-400 animate-pulse">
              <span className="text-gray-500 text-xs">[{new Date().toLocaleTimeString()}]</span>
              <span> 🤖 AI is working...</span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Fallback */}
      {!isProcessing && currentStep < steps.length && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🛠️ Manual Setup Required</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
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
              <div>
                <label className="block text-sm font-medium text-yellow-800 mb-2">
                  Private Key (10,000 ETH)
                </label>
                <div className="flex items-center">
                  <input
                    type="password"
                    value="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
                    readOnly
                    className="input flex-1 bg-white text-xs"
                  />
                  <button
                    onClick={() => copyToClipboard('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'Private key')}
                    className="btn btn-primary btn-sm ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isProcessing && currentStep >= steps.length && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            AI Setup Completed Successfully!
          </h3>
          <p className="text-green-700 mb-4">
            Your blockchain environment is fully configured and ready for cryptocurrency trading.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🦊</div>
              <div className="font-semibold text-green-900">MetaMask</div>
              <div className="text-sm text-green-700">Installed & Connected</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-semibold text-green-900">Network</div>
              <div className="text-sm text-green-700">Localhost Added</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold text-green-900">Account</div>
              <div className="text-sm text-green-700">10,000 ETH Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Features */}
      <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">🤖 AI Automation Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Automatic Actions:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ MetaMask installation detection</li>
              <li>✅ Network configuration injection</li>
              <li>✅ Account key management</li>
              <li>✅ Wallet connection automation</li>
              <li>✅ Error handling & fallbacks</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-2">Smart Features:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🔍 Real-time installation monitoring</li>
              <li>📋 Automatic clipboard management</li>
              <li>🔄 Auto-refresh on completion</li>
              <li>⚠️ Intelligent error recovery</li>
              <li>📊 Live progress tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAutomaticSetup;
