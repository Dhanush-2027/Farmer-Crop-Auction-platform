const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Load users data
const loadUsers = () => {
  try {
    const farmersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/farmers.json'), 'utf8'));
    const buyersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/buyers.json'), 'utf8'));
    return { farmers: farmersData, buyers: buyersData };
  } catch (error) {
    return { farmers: [], buyers: [] };
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Check if user is farmer
const isFarmer = (req, res, next) => {
  if (req.user.userType !== 'farmer') {
    return res.status(403).json({ message: 'Access denied. Farmers only.' });
  }
  next();
};

// Check if user is buyer
const isBuyer = (req, res, next) => {
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({ message: 'Access denied. Buyers only.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isFarmer,
  isBuyer,
  loadUsers
};
