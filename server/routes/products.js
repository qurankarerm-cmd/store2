const express = require('express');
const Product = require('../models/Product');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      featured,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { active: true };

    // Filter by category
    if (category && category !== 'الكل') {
      query.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Search functionality
    let products;
    if (search) {
      products = await Product.searchProducts(
        search,
        category,
        parseInt(limit),
        skip
      );
    } else {
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortObject = {};
      sortObject[sort] = sortOrder;

      products = await Product.find(query)
        .sort(sortObject)
        .limit(parseInt(limit))
        .skip(skip);
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products'
    });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const products = await Product.getFeatured(parseInt(limit));

    res.json({
      success: true,
      data: {
        products
      }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving featured products'
    });
  }
});

// @route   GET /api/products/categories
// @desc    Get product categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalProducts = await Product.countDocuments({ active: true });

    const result = [
      { name: 'الكل', count: totalProducts },
      ...categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    ];

    res.json({
      success: true,
      data: {
        categories: result
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving categories'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      active: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment click count (without blocking response)
    product.incrementClickCount().catch(err => 
      console.error('Error incrementing click count:', err)
    );

    res.json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product'
    });
  }
});

// @route   POST /api/products/:id/whatsapp-click
// @desc    Track WhatsApp button clicks
// @access  Public
router.post('/:id/whatsapp-click', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      active: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment WhatsApp clicks
    await product.incrementWhatsAppClicks();

    res.json({
      success: true,
      message: 'WhatsApp click tracked'
    });
  } catch (error) {
    console.error('Track WhatsApp click error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking WhatsApp click'
    });
  }
});

// ADMIN ROUTES (require authentication)

// @route   GET /api/products/admin/all
// @desc    Get all products for admin (including inactive)
// @access  Private (Admin)
router.get('/admin/all', [auth, authorize('products:read')], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Filter by category
    if (category && category !== 'الكل') {
      query.category = category;
    }

    // Filter by status
    if (status === 'active') {
      query.active = true;
    } else if (status === 'inactive') {
      query.active = false;
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObject = {};
    sortObject[sort] = sortOrder;

    if (search && !sortObject.score) {
      sortObject.score = { $meta: 'textScore' };
    }

    const products = await Product.find(query)
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin)
router.post('/', [auth, authorize('products:create')], async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Set created by user
    productData.createdBy = req.user._id;

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin)
router.put('/:id', [auth, authorize('products:update')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private (Admin)
router.delete('/:id', [auth, authorize('products:delete')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete (deactivate)
    product.active = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// @route   PUT /api/products/:id/toggle-featured
// @desc    Toggle product featured status
// @access  Private (Admin)
router.put('/:id/toggle-featured', [auth, authorize('products:update')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        product
      }
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product featured status'
    });
  }
});

// @route   GET /api/products/admin/stats
// @desc    Get product statistics
// @access  Private (Admin)
router.get('/admin/stats', [auth, authorize('products:read')], async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
          },
          featuredProducts: {
            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
          },
          totalClicks: { $sum: '$clickCount' },
          totalWhatsAppClicks: { $sum: '$whatsappClicks' }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalClicks: { $sum: '$clickCount' },
          totalWhatsAppClicks: { $sum: '$whatsappClicks' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const topProducts = await Product.find({ active: true })
      .sort({ clickCount: -1 })
      .limit(5)
      .select('name clickCount whatsappClicks category');

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          featuredProducts: 0,
          totalClicks: 0,
          totalWhatsAppClicks: 0
        },
        categoryStats,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product statistics'
    });
  }
});

module.exports = router;