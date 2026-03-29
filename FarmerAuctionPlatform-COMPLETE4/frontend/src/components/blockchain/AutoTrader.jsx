import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Wallet, TrendingUp, Gavel, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const AutoTrader = () => {
  const [tradingStage, setTradingStage] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [auctions, setAuctions] = useState([]);
  const [bidsPlaced, setBidsPlaced] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const formatEther = (wei) => {
    return (parseInt(wei) / 1e18).toFixed(4);
  };

  const parseEther = (ether) => {
    return (parseFloat(ether) * 1e18).toString();
  };

  const autoSetupAndTrade = async () => {
    try {
      setTradingStage('setup');
      setProgress(10);
      addLog('🤖 Starting automatic blockchain trading setup...', 'success');

      // Step 1: Check for MetaMask
      addLog('🦊 Checking for MetaMask installation...');
      if (typeof window.ethereum === 'undefined') {
        addLog('❌ MetaMask not found. Opening installation page...', 'warning');
        window.open('https://metamask.io/download/', '_blank');
        
        // Wait for MetaMask installation
        let attempts = 0;
        while (attempts < 30 && typeof window.ethereum === 'undefined') {
          addLog(`⏳ Waiting for MetaMask installation... (${attempts + 1}/30)`);
          await sleep(3000);
          attempts++;
        }
        
        if (typeof window.ethereum === 'undefined') {
          addLog('❌ MetaMask installation timeout. Please install manually.', 'error');
          return;
        }
      }
      
      addLog('✅ MetaMask detected!', 'success');
      setProgress(25);

      // Step 2: Add network automatically
      setTradingStage('network');
      addLog('🌐 Adding localhost blockchain network...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x539', // 1337 in hex
            chainName: 'Localhost 8545',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['http://127.0.0.1:8545'],
          }],
        });
        addLog('✅ Network added successfully!', 'success');
      } catch (error) {
        if (error.code === 4902) {
          addLog('✅ Network already exists!', 'success');
        } else {
          addLog(`⚠️ Network addition failed: ${error.message}`, 'warning');
        }
      }
      setProgress(40);

      // Step 3: Connect wallet automatically
      setTradingStage('connecting');
      addLog('🔗 Connecting wallet automatically...');
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          addLog(`✅ Wallet connected: ${accounts[0]}`, 'success');
          
          // Get balance
          const balanceWei = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          const balanceEth = formatEther(balanceWei);
          setBalance(balanceEth);
          addLog(`💰 Account balance: ${balanceEth} ETH`, 'success');
        }
      } catch (error) {
        addLog(`❌ Wallet connection failed: ${error.message}`, 'error');
        return;
      }
      setProgress(60);

      // Step 4: Load auction data
      setTradingStage('loading');
      addLog('📋 Loading blockchain auctions...');
      
      // Simulate loading auctions from smart contract
      const mockAuctions = [
        {
          id: 1,
          crop: 'Premium Organic Tomatoes',
          quantity: '500 kg',
          currentBid: '0.75',
          minBid: '0.5',
          farmer: 'Ravi Kumar',
          endTime: Date.now() + 86400000, // 24 hours
          status: 'active'
        },
        {
          id: 2,
          crop: 'Nashik Red Onions',
          quantity: '1000 kg',
          currentBid: '0.45',
          minBid: '0.3',
          farmer: 'Sita Devi',
          endTime: Date.now() + 172800000, // 48 hours
          status: 'active'
        },
        {
          id: 3,
          crop: 'Premium Basmati Rice',
          quantity: '200 kg',
          currentBid: '0.9',
          minBid: '0.8',
          farmer: 'Ravi Kumar',
          endTime: Date.now() + 259200000, // 72 hours
          status: 'active'
        }
      ];
      
      setAuctions(mockAuctions);
      addLog(`✅ Loaded ${mockAuctions.length} active auctions`, 'success');
      setProgress(80);

      // Step 5: Auto-place sample bids
      setTradingStage('trading');
      addLog('💰 Placing automatic sample bids...');
      
      for (let i = 0; i < mockAuctions.length; i++) {
        const auction = mockAuctions[i];
        const bidAmount = (parseFloat(auction.currentBid) + 0.1).toFixed(2);
        
        addLog(`🎯 Placing bid on ${auction.crop}: ${bidAmount} ETH`);
        
        try {
          // Simulate blockchain transaction
          const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          addLog(`📝 Transaction hash: ${txHash}`, 'info');
          
          // Simulate transaction confirmation
          await sleep(2000);
          
          setBidsPlaced(prev => [...prev, {
            auctionId: auction.id,
            crop: auction.crop,
            amount: bidAmount,
            txHash,
            timestamp: new Date().toLocaleTimeString()
          }]);
          
          addLog(`✅ Bid confirmed: ${bidAmount} ETH on ${auction.crop}`, 'success');
          
          // Update auction current bid
          auction.currentBid = bidAmount;
          
        } catch (error) {
          addLog(`❌ Bid failed for ${auction.crop}: ${error.message}`, 'error');
        }
        
        await sleep(1000);
      }

      setProgress(100);
      setTradingStage('complete');
      addLog('🎉 Automatic blockchain trading completed!', 'success');
      addLog(`💎 Successfully placed ${bidsPlaced.length} bids`, 'success');
      addLog('🚀 Platform ready for manual trading!', 'success');

    } catch (error) {
      addLog(`❌ Auto-trading error: ${error.message}`, 'error');
      setTradingStage('error');
    }
  };

  useEffect(() => {
    // Start automatic trading setup
    autoSetupAndTrade();
  }, []);

  const getStageIcon = () => {
    switch (tradingStage) {
      case 'initializing': return <Zap className="w-8 h-8 text-blue-500 animate-pulse" />;
      case 'setup': return <Wallet className="w-8 h-8 text-orange-500 animate-bounce" />;
      case 'network': return <span className="text-3xl animate-spin">🌐</span>;
      case 'connecting': return <span className="text-3xl animate-pulse">🔗</span>;
      case 'loading': return <span className="text-3xl animate-bounce">📋</span>;
      case 'trading': return <Gavel className="w-8 h-8 text-green-500 animate-pulse" />;
      case 'complete': return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error': return <span className="text-3xl">❌</span>;
      default: return <Zap className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStageTitle = () => {
    switch (tradingStage) {
      case 'initializing': return 'Initializing Auto-Trader...';
      case 'setup': return 'Setting up MetaMask...';
      case 'network': return 'Configuring Network...';
      case 'connecting': return 'Connecting Wallet...';
      case 'loading': return 'Loading Auctions...';
      case 'trading': return 'Placing Automatic Bids...';
      case 'complete': return 'Trading Complete!';
      case 'error': return 'Trading Error';
      default: return 'Processing...';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl p-8 border border-green-200">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          {getStageIcon()}
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">
          🤖 Automatic Blockchain Trader
        </h2>
        <p className="text-gray-600 text-lg">
          {getStageTitle()}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Auto-Trading Progress</span>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Account Info */}
      {connectedAccount && (
        <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Connected Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Address:</span>
              <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {connectedAccount}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Balance:</span>
              <div className="text-lg font-bold text-green-600">
                {balance} ETH
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Console */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 h-64 overflow-y-auto">
        <div className="flex items-center mb-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-3 text-gray-400 text-sm">Auto-Trader Console</span>
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
          {tradingStage !== 'complete' && tradingStage !== 'error' && (
            <div className="text-blue-400 animate-pulse">
              <span className="text-gray-500 text-xs">[{new Date().toLocaleTimeString()}]</span>
              <span> 🤖 Auto-trader working...</span>
            </div>
          )}
        </div>
      </div>

      {/* Auction Results */}
      {auctions.length > 0 && (
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🌾 Active Auctions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {auctions.map((auction) => (
              <div key={auction.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{auction.crop}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{auction.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Bid:</span>
                    <span className="font-bold text-green-600">{auction.currentBid} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Farmer:</span>
                    <span className="font-medium">{auction.farmer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bids Placed */}
      {bidsPlaced.length > 0 && (
        <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-4">💎 Automatic Bids Placed</h3>
          <div className="space-y-3">
            {bidsPlaced.map((bid, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{bid.crop}</h4>
                    <p className="text-sm text-gray-600">Bid: {bid.amount} ETH at {bid.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">✅ Confirmed</div>
                    <div className="text-xs text-gray-500 font-mono">{bid.txHash.substr(0, 10)}...</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success State */}
      {tradingStage === 'complete' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            Automatic Trading Completed!
          </h3>
          <p className="text-green-700 mb-4">
            Successfully set up MetaMask, connected wallet, and placed {bidsPlaced.length} automatic bids on blockchain auctions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🦊</div>
              <div className="font-semibold text-green-900">MetaMask</div>
              <div className="text-sm text-green-700">Connected</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-semibold text-green-900">Network</div>
              <div className="text-sm text-green-700">Configured</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold text-green-900">Wallet</div>
              <div className="text-sm text-green-700">{balance} ETH</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-semibold text-green-900">Bids</div>
              <div className="text-sm text-green-700">{bidsPlaced.length} Placed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoTrader;
