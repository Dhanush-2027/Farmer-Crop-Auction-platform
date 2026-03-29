const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataManager = require('../utils/dataManager');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      userType: user.userType, 
      phone: user.phone 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register Farmer
router.post('/register/farmer', async (req, res) => {
  try {
    const { name, phone, state, district, crops, password, language = 'en' } = req.body;

    // Validation
    if (!name || !phone || !state || !district || !crops || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if farmer already exists
    const existingFarmers = dataManager.getAll('farmers.json');
    const existingFarmer = existingFarmers.find(f => f.phone === phone);
    
    if (existingFarmer) {
      return res.status(400).json({ message: 'Farmer with this phone number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create farmer
    const farmer = dataManager.create('farmers.json', {
      name,
      phone,
      state,
      district,
      crops: Array.isArray(crops) ? crops : [crops],
      password: hashedPassword,
      userType: 'farmer',
      language,
      isActive: true
    });

    // Remove password from response
    const { password: _, ...farmerResponse } = farmer;

    // Generate token
    const token = generateToken(farmer);

    res.status(201).json({
      message: 'Farmer registered successfully',
      user: farmerResponse,
      token
    });
  } catch (error) {
    console.error('Farmer registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Register Buyer
router.post('/register/buyer', async (req, res) => {
  try {
    const { name, phone, businessName, interestedCrops, location, password, language = 'en' } = req.body;

    // Validation
    if (!name || !phone || !interestedCrops || !location || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if buyer already exists
    const existingBuyers = dataManager.getAll('buyers.json');
    const existingBuyer = existingBuyers.find(b => b.phone === phone);
    
    if (existingBuyer) {
      return res.status(400).json({ message: 'Buyer with this phone number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create buyer
    const buyer = dataManager.create('buyers.json', {
      name,
      phone,
      businessName: businessName || '',
      interestedCrops: Array.isArray(interestedCrops) ? interestedCrops : [interestedCrops],
      location,
      password: hashedPassword,
      userType: 'buyer',
      language,
      isActive: true
    });

    // Remove password from response
    const { password: _, ...buyerResponse } = buyer;

    // Generate token
    const token = generateToken(buyer);

    res.status(201).json({
      message: 'Buyer registered successfully',
      user: buyerResponse,
      token
    });
  } catch (error) {
    console.error('Buyer registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, password, userType } = req.body;

    if (!phone || !password || !userType) {
      return res.status(400).json({ message: 'Phone, password, and user type are required' });
    }

    // Find user based on type
    const filename = userType === 'farmer' ? 'farmers.json' : 'buyers.json';
    const users = dataManager.getAll(filename);
    const user = users.find(u => u.phone === phone);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const filename = req.user.userType === 'farmer' ? 'farmers.json' : 'buyers.json';
    const user = dataManager.findById(filename, req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const filename = req.user.userType === 'farmer' ? 'farmers.json' : 'buyers.json';
    const updates = { ...req.body };
    
    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = dataManager.update(filename, req.user.id, updates);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
