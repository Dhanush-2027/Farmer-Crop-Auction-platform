import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Wallet, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import InstantSetup from './InstantSetup';
import MetaMaskAutoInstaller from './MetaMaskAutoInstaller';
import FullyAutomaticSetup from './FullyAutomaticSetup';
import SuperAutomaticSetup from './SuperAutomaticSetup';
import AutoTrader from './AutoTrader';

const WalletConnect = () => {
  const {
    account,
    balance,
    chainId,
    isConnected,
    isConnecting,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    formatAddress
  } = useWeb3();

  const expectedChainId = 1337; // Local development chain

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">💰 Get Paid with Digital Money</h3>
          <p className="text-gray-600 mb-6">
            Install a simple app to receive instant payments from buyers worldwide
          </p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            📱 Install Payment App
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Connect Wallet</h3>
              <p className="text-sm text-blue-700">
                Connect your MetaMask wallet to use blockchain features
              </p>
            </div>
          </div>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn btn-primary btn-sm"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  const isWrongNetwork = chainId !== expectedChainId;

  return (
    <div className={`border rounded-lg p-4 ${
      isWrongNetwork ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {isWrongNetwork ? (
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          )}
          <div>
            <h3 className={`text-sm font-medium ${
              isWrongNetwork ? 'text-red-800' : 'text-green-800'
            }`}>
              {isWrongNetwork ? 'Wrong Network' : 'Wallet Connected'}
            </h3>
            <div className={`text-sm ${
              isWrongNetwork ? 'text-red-700' : 'text-green-700'
            }`}>
              <p>Account: {formatAddress(account)}</p>
              <p>Balance: {parseFloat(balance).toFixed(4)} ETH</p>
              {isWrongNetwork && (
                <p className="text-red-600 font-medium">
                  Please switch to localhost network (Chain ID: {expectedChainId})
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isWrongNetwork && (
            <button
              onClick={() => switchNetwork(expectedChainId)}
              className="btn btn-warning btn-sm"
            >
              Switch Network
            </button>
          )}
          <button
            onClick={disconnectWallet}
            className="btn btn-outline btn-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
