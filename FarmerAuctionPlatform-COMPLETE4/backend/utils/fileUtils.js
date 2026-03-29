const fs = require('fs');
const path = require('path');

/**
 * Utility functions for file operations
 */

/**
 * Read JSON file safely
 * @param {string} filePath - Path to the JSON file
 * @returns {Array|Object} - Parsed JSON data or empty array/object
 */
const readJSONFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return [];
  }
};

/**
 * Write JSON file safely
 * @param {string} filePath - Path to the JSON file
 * @param {Array|Object} data - Data to write
 * @returns {boolean} - Success status
 */
const writeJSONFile = (filePath, data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    return false;
  }
};

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Get file extension
 * @param {string} filename - File name
 * @returns {string} - File extension
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Check if file is an image
 * @param {string} filename - File name
 * @returns {boolean} - True if image file
 */
const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.includes(getFileExtension(filename));
};

/**
 * Generate unique filename
 * @param {string} originalName - Original file name
 * @returns {string} - Unique file name
 */
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${baseName}_${timestamp}_${random}${extension}`;
};

/**
 * Delete file safely
 * @param {string} filePath - Path to file
 * @returns {boolean} - Success status
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

module.exports = {
  readJSONFile,
  writeJSONFile,
  ensureDirectoryExists,
  getFileExtension,
  isImageFile,
  generateUniqueFilename,
  deleteFile
};
