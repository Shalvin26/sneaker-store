const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, isAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Cloudinary gives a URL instead of a filename
    const imageUrl = req.file.path;

    res.json({ 
      message: 'Image uploaded successfully',
      imagePath: imageUrl  // this is now a full Cloudinary URL
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;