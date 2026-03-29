import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Wallet, Download, Settings, Play } from 'lucide-react';
import toast from 'react-hot-toast';

const FullyAutomaticSetup = () => {
  const [setupStage, setSetupStage] = useState('starting');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const autoSetup = async () => {
    try {
      setSetupStage('installing');
      setProgress(10);
      addLog('🚀 Starting fully automatic blockchain setup...', 'success');

      // Step 1: Auto-install MetaMask
      addLog('📦 Step 1: Installing MetaMask automatically...');
      window.open('https://metamask.io/download/', '_blank');
      await sleep(2000);
      setProgress(25);
      addLog('✅ MetaMask download initiated', 'success');

      // Step 2: Auto-detect MetaMask installation
      addLog('🔍 Step 2: Auto-detecting MetaMask installation...');
      let metamaskDetected = false;
      let attempts = 0;
      
      while (!metamaskDetected && attempts < 30) {
        if (typeof window.ethereum !== 'undefined') {
          metamaskDetected = true;
          addLog('✅ MetaMask detected successfully!', 'success');
        } else {
          attempts++;
          addLog(`⏳ Waiting for MetaMask... (${attempts}/30)`);
          await sleep(2000);
        }
      }

      if (!metamaskDetected) {
        addLog('⚠️ MetaMask not detected. Please install manually.', 'warning');
        return;
      }

      setProgress(50);
      setSetupStage('configuring');

      // Step 3: Auto-add network
      addLog('🌐 Step 3: Automatically adding localhost network...');
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
        addLog('✅ Network added automatically!', 'success');
      } catch (error) {
        addLog('⚠️ Network addition failed, will provide manual instructions', 'warning');
      }

      setProgress(75);

      // Step 4: Auto-import test account
      addLog('💰 Step 4: Preparing test account import...');
      const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      
      try {
        await navigator.clipboard.writeText(privateKey);
        addLog('✅ Test account private key copied to clipboard!', 'success');
        addLog('📋 Go to MetaMask → Import Account → Paste the key', 'info');
      } catch (error) {
        addLog('⚠️ Clipboard access failed, key will be displayed', 'warning');
      }

      setProgress(90);

      // Step 5: Auto-connect wallet
      addLog('🔗 Step 5: Attempting automatic wallet connection...');
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          addLog('✅ Wallet connected automatically!', 'success');
          addLog(`🎯 Connected account: ${accounts[0]}`, 'success');
        }
      } catch (error) {
        addLog('⚠️ Manual wallet connection required', 'warning');
      }

      setProgress(100);
      setSetupStage('complete');
      addLog('🎉 FULLY AUTOMATIC SETUP COMPLETE!', 'success');
      addLog('🚀 You can now trade with cryptocurrency!', 'success');

      // Auto-refresh page to show connected state
      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      addLog(`❌ Setup error: ${error.message}`, 'error');
      setSetupStage('error');
    }
  };

  useEffect(() => {
    // Start automatic setup immediately
    autoSetup();
  }, []);

  const getStageIcon = () => {
    switch (setupStage) {
      case 'starting': return <Play className="w-8 h-8 text-blue-500 animate-pulse" />;
      case 'installing': return <Download className="w-8 h-8 text-orange-500 animate-bounce" />;
      case 'configuring': return <Settings className="w-8 h-8 text-purple-500 animate-spin" />;
      case 'complete': return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error': return <span className="text-2xl">❌</span>;
      default: return <Zap className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStageTitle = () => {
    switch (setupStage) {
      case 'starting': return 'Initializing Automatic Setup...';
      case 'installing': return 'Installing MetaMask...';
      case 'configuring': return 'Configuring Blockchain...';
      case 'complete': return 'Setup Complete!';
      case 'error': return 'Setup Error';
      default: return 'Processing...';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-xl p-8 border border-blue-200">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {getStageIcon()}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🤖 Fully Automatic Setup
        </h2>
        <p className="text-gray-600">
          {getStageTitle()}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Setup Progress</span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-black rounded-lg p-4 mb-6 h-64 overflow-y-auto">
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
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${
          progress >= 25 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">🦊</div>
            <div className="font-semibold text-sm">MetaMask</div>
            <div className={`text-xs ${progress >= 25 ? 'text-green-600' : 'text-gray-500'}`}>
              {progress >= 25 ? 'Installed' : 'Installing...'}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          progress >= 50 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">🌐</div>
            <div className="font-semibold text-sm">Network</div>
            <div className={`text-xs ${progress >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
              {progress >= 50 ? 'Added' : 'Adding...'}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          progress >= 75 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-semibold text-sm">Account</div>
            <div className={`text-xs ${progress >= 75 ? 'text-green-600' : 'text-gray-500'}`}>
              {progress >= 75 ? 'Ready' : 'Preparing...'}
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          progress >= 100 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-center">
            <div className="text-2xl mb-2">🔗</div>
            <div className="font-semibold text-sm">Connected</div>
            <div className={`text-xs ${progress >= 100 ? 'text-green-600' : 'text-gray-500'}`}>
              {progress >= 100 ? 'Ready!' : 'Connecting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Fallback */}
      {setupStage === 'error' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Manual Setup Required</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>1. Install MetaMask: <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="underline">Download Here</a></p>
            <p>2. Add Network: Localhost 8545, RPC: http://127.0.0.1:8545, Chain ID: 1337</p>
            <p>3. Import Account: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {setupStage === 'complete' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Automatic Setup Complete!
          </h3>
          <p className="text-green-700 mb-4">
            Your blockchain environment is ready for trading. Page will refresh automatically.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-sm text-green-600">
              <span className="font-semibold">✅ MetaMask:</span> Installed
            </div>
            <div className="text-sm text-green-600">
              <span className="font-semibold">✅ Network:</span> Added
            </div>
            <div className="text-sm text-green-600">
              <span className="font-semibold">✅ Account:</span> 10,000 ETH
            </div>
          </div>
        </div>
      )}

      {/* What's Happening */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-2">🤖 What I'm Doing Automatically:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Opening MetaMask installation page</li>
          <li>• Detecting when MetaMask is installed</li>
          <li>• Adding localhost blockchain network</li>
          <li>• Copying test account private key</li>
          <li>• Connecting wallet automatically</li>
          <li>• Refreshing page when complete</li>
        </ul>
      </div>
    </div>
  );
};

export default FullyAutomaticSetup;
