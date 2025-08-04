const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const createUploadsDir = async () => {
  try {
    await fs.access(path.join(__dirname, '../uploads'));
  } catch (error) {
    await fs.mkdir(path.join(__dirname, '../uploads'), { recursive: true });
  }
};

// Initialize uploads directory
createUploadsDir();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files at once
  }
});

// Helper function to format file info
const formatFileInfo = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: `/uploads/${file.filename}`,
  size: file.size,
  mimetype: file.mimetype
});

// @route   POST /api/upload/single
// @desc    Upload single image
// @access  Private (Admin)
router.post('/single', [auth, authorize('products:create', 'products:update')], upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileInfo = formatFileInfo(req.file);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileInfo
      }
    });
  } catch (error) {
    console.error('Single upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading file'
    });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private (Admin)
router.post('/multiple', [auth, authorize('products:create', 'products:update')], upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const filesInfo = req.files.map(formatFileInfo);

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: {
        files: filesInfo
      }
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading files'
    });
  }
});

// @route   POST /api/upload/product
// @desc    Upload product images (specialized endpoint)
// @access  Private (Admin)
router.post('/product', [auth, authorize('products:create', 'products:update')], upload.array('productImages', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No product images uploaded'
      });
    }

    const filesInfo = req.files.map(formatFileInfo);

    res.json({
      success: true,
      message: `${req.files.length} product images uploaded successfully`,
      data: {
        images: filesInfo
      }
    });
  } catch (error) {
    console.error('Product upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading product images'
    });
  }
});

// @route   POST /api/upload/review
// @desc    Upload review customer photo
// @access  Public (for customer reviews)
router.post('/review', upload.single('customerPhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No customer photo uploaded'
      });
    }

    const fileInfo = formatFileInfo(req.file);

    res.json({
      success: true,
      message: 'Customer photo uploaded successfully',
      data: {
        photo: fileInfo
      }
    });
  } catch (error) {
    console.error('Review upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading customer photo'
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private (Admin)
router.delete('/:filename', [auth, authorize('products:delete')], async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    await fs.unlink(filePath);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

// @route   GET /api/upload/list
// @desc    List all uploaded files
// @access  Private (Admin)
router.get('/list', [auth, authorize('products:read')], async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    let files;
    try {
      files = await fs.readdir(uploadsDir);
    } catch (error) {
      return res.json({
        success: true,
        data: {
          files: []
        }
      });
    }

    // Filter image files only and get file stats
    const imageFiles = [];
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      try {
        const stats = await fs.stat(filePath);
        const ext = path.extname(file).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          imageFiles.push({
            filename: file,
            path: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          });
        }
      } catch (error) {
        // Skip files that can't be accessed
        continue;
      }
    }

    // Sort by creation date (newest first)
    imageFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        files: imageFiles,
        total: imageFiles.length
      }
    });
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files'
    });
  }
});

// @route   GET /api/upload/info/:filename
// @desc    Get file information
// @access  Private (Admin)
router.get('/info/:filename', [auth], async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists and get stats
    let stats;
    try {
      stats = await fs.stat(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const fileInfo = {
      filename: filename,
      path: `/uploads/${filename}`,
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      isImage: ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(
        path.extname(filename).toLowerCase()
      )
    };

    res.json({
      success: true,
      data: {
        file: fileInfo
      }
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting file information'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Error uploading file'
  });
});

module.exports = router;