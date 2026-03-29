import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

// Import contract ABIs
import FarmerAuctionABI from '../contracts/FarmerAuction.json';
import ProduceNFTABI from '../contracts/ProduceNFT.json';
import deployments from '../contracts/deployments.json';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contracts, setContracts] = useState({});
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState('0');

  // Contract addresses (deployed and ready)
  const CONTRACT_ADDRESSES = {
    FarmerAuction: deployments?.contracts?.FarmerAuction?.address || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    ProduceNFT: deployments?.contracts?.ProduceNFT?.address || '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('Please install MetaMask to use blockchain features');
      return false;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      // Get balance
      const accountBalance = await web3Provider.getBalance(accounts[0]);
      setBalance(ethers.formatEther(accountBalance));

      // Initialize contracts
      await initializeContracts(web3Signer);

      toast.success('Wallet connected successfully!');
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet: ' + error.message);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Initialize smart contracts
  const initializeContracts = async (signerInstance) => {
    try {
      const farmerAuction = new ethers.Contract(
        CONTRACT_ADDRESSES.FarmerAuction,
        FarmerAuctionABI,
        signerInstance
      );

      const produceNFT = new ethers.Contract(
        CONTRACT_ADDRESSES.ProduceNFT,
        ProduceNFTABI,
        signerInstance
      );

      setContracts({
        farmerAuction,
        produceNFT
      });

      console.log('Contracts initialized successfully');
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      toast.error('Failed to initialize smart contracts');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContracts({});
    setChainId(null);
    setBalance('0');
    toast.success('Wallet disconnected');
  };

  // Switch to correct network
  const switchNetwork = async (targetChainId = 1337) => {
    if (!isMetaMaskInstalled()) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: 'Localhost 8545',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['http://127.0.0.1:8545'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add network:', addError);
          return false;
        }
      }
      console.error('Failed to switch network:', error);
      return false;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        // Reconnect with new account
        connectWallet();
      }
    };

    const handleChainChanged = (chainId) => {
      setChainId(Number(chainId));
      // Reload the page to reset the dapp state
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Auto-connect failed:', error);
      }
    };

    autoConnect();
  }, []);

  // Utility functions
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatEther = (value) => {
    return ethers.formatEther(value);
  };

  const parseEther = (value) => {
    return ethers.parseEther(value.toString());
  };

  // Contract interaction helpers
  const registerFarmer = async (name, location) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.registerFarmer(name, location);
    await tx.wait();
    return tx;
  };

  const registerBuyer = async (name, businessName) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.registerBuyer(name, businessName);
    await tx.wait();
    return tx;
  };

  const createAuction = async (cropName, quantity, unit, minimumBid, duration, ipfsHash) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.createAuction(
      cropName,
      quantity,
      unit,
      parseEther(minimumBid),
      duration,
      ipfsHash
    );
    await tx.wait();
    return tx;
  };

  const placeBid = async (auctionId, bidAmount) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.placeBid(auctionId, {
      value: parseEther(bidAmount)
    });
    await tx.wait();
    return tx;
  };

  const endAuction = async (auctionId) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.endAuction(auctionId);
    await tx.wait();
    return tx;
  };

  const releaseFunds = async (auctionId) => {
    if (!contracts.farmerAuction) throw new Error('Contract not initialized');
    
    const tx = await contracts.farmerAuction.releaseFunds(auctionId);
    await tx.wait();
    return tx;
  };

  const value = {
    // State
    account,
    provider,
    signer,
    contracts,
    chainId,
    balance,
    isConnecting,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),

    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,

    // Utilities
    formatAddress,
    formatEther,
    parseEther,

    // Contract interactions
    registerFarmer,
    registerBuyer,
    createAuction,
    placeBid,
    endAuction,
    releaseFunds,

    // Contract addresses
    CONTRACT_ADDRESSES
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
