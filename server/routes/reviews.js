const express = require('express');
const Review = require('../models/Review');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get approved reviews (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      rating,
      featured,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { approved: true };

    // Filter by rating
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObject = {};
    
    // Sort by featured first, then by specified field
    if (featured !== 'true') {
      sortObject.featured = -1;
    }
    sortObject[sort] = sortOrder;

    const reviews = await Review.find(query)
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('productId', 'name category');

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reviews'
    });
  }
});

// @route   GET /api/reviews/featured
// @desc    Get featured reviews
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const reviews = await Review.getFeatured(parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get featured reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving featured reviews'
    });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Review.getAverageRating();
    
    // Calculate rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = 0;
    }
    
    ratingStats.forEach(stat => {
      distribution[stat._id] = stat.count;
    });

    const result = stats[0] || {
      averageRating: 0,
      totalReviews: 0
    };

    result.ratingDistribution = distribution;

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving review statistics'
    });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for specific product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const reviews = await Review.getProductReviews(
      req.params.productId,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving product reviews'
    });
  }
});

// @route   POST /api/reviews
// @desc    Submit new review (public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      rating,
      comment,
      product,
      productId,
      contactMethod = 'whatsapp',
      customerLocation
    } = req.body;

    // Validation
    if (!name || !rating || !comment || !product) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, comment, and product are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Create review
    const review = new Review({
      name,
      rating: parseInt(rating),
      comment,
      product,
      productId: productId || null,
      contactMethod,
      customerLocation,
      approved: false, // Reviews need admin approval
      verified: false
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. It will be published after review.',
      data: {
        review: {
          _id: review._id,
          name: review.displayName,
          rating: review.rating,
          comment: review.comment,
          product: review.product,
          createdAt: review.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error submitting review'
    });
  }
});

// ADMIN ROUTES (require authentication)

// @route   GET /api/reviews/admin/all
// @desc    Get all reviews for admin (including pending)
// @access  Private (Admin)
router.get('/admin/all', [auth, authorize('reviews:read')], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      rating,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Filter by approval status
    if (status === 'approved') {
      query.approved = true;
    } else if (status === 'pending') {
      query.approved = false;
    }

    // Filter by rating
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObject = {};
    sortObject[sort] = sortOrder;

    const reviews = await Review.find(query)
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('productId', 'name category');

    const total = await Review.countDocuments(query);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving reviews'
    });
  }
});

// @route   GET /api/reviews/admin/pending
// @desc    Get pending reviews
// @access  Private (Admin)
router.get('/admin/pending', [auth, authorize('reviews:read')], async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const reviews = await Review.find({ approved: false })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('productId', 'name category');

    res.json({
      success: true,
      data: {
        reviews
      }
    });
  } catch (error) {
    console.error('Get pending reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving pending reviews'
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve review
// @access  Private (Admin)
router.put('/:id/approve', [auth, authorize('reviews:approve')], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.approve();

    res.json({
      success: true,
      message: 'Review approved successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving review'
    });
  }
});

// @route   PUT /api/reviews/:id/feature
// @desc    Toggle review featured status
// @access  Private (Admin)
router.put('/:id/feature', [auth, authorize('reviews:update')], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.featured = !review.featured;
    await review.save();

    res.json({
      success: true,
      message: `Review ${review.featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Feature review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review featured status'
    });
  }
});

// @route   PUT /api/reviews/:id/verify
// @desc    Toggle review verified status
// @access  Private (Admin)
router.put('/:id/verify', [auth, authorize('reviews:update')], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.verified = !review.verified;
    await review.save();

    res.json({
      success: true,
      message: `Review ${review.verified ? 'verified' : 'unverified'} successfully`,
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Verify review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review verified status'
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private (Admin)
router.put('/:id', [auth, authorize('reviews:update')], async (req, res) => {
  try {
    const {
      name,
      rating,
      comment,
      product,
      adminNotes,
      tags
    } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update fields
    if (name) review.name = name;
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment;
    if (product) review.product = product;
    if (adminNotes !== undefined) review.adminNotes = adminNotes;
    if (tags) review.tags = tags;

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating review'
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Admin)
router.delete('/:id', [auth, authorize('reviews:delete')], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
});

// @route   GET /api/reviews/admin/stats
// @desc    Get review statistics for admin
// @access  Private (Admin)
router.get('/admin/stats', [auth, authorize('reviews:read')], async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          approvedReviews: {
            $sum: { $cond: [{ $eq: ['$approved', true] }, 1, 0] }
          },
          pendingReviews: {
            $sum: { $cond: [{ $eq: ['$approved', false] }, 1, 0] }
          },
          featuredReviews: {
            $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
          },
          verifiedReviews: {
            $sum: { $cond: [{ $eq: ['$verified', true] }, 1, 0] }
          },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const ratingDistribution = await Review.aggregate([
      { $match: { approved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const recentReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('productId', 'name');

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalReviews: 0,
          approvedReviews: 0,
          pendingReviews: 0,
          featuredReviews: 0,
          verifiedReviews: 0,
          averageRating: 0
        },
        ratingDistribution,
        recentReviews
      }
    });
  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving review statistics'
    });
  }
});

module.exports = router;