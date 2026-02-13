const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Image uploaded successfully',
      imagePath: filePath 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;