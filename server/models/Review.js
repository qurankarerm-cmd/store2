const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم العميل مطلوب'],
    trim: true,
    maxlength: [50, 'اسم العميل لا يجب أن يتجاوز 50 حرف']
  },
  rating: {
    type: Number,
    required: [true, 'التقييم مطلوب'],
    min: [1, 'التقييم الأدنى هو 1'],
    max: [5, 'التقييم الأقصى هو 5']
  },
  comment: {
    type: String,
    required: [true, 'نص التقييم مطلوب'],
    trim: true,
    maxlength: [1000, 'نص التقييم لا يجب أن يتجاوز 1000 حرف']
  },
  product: {
    type: String,
    required: [true, 'اسم المنتج مطلوب'],
    trim: true,
    maxlength: [100, 'اسم المنتج لا يجب أن يتجاوز 100 حرف']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false // Optional since customers might review general service
  },
  customerPhoto: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  contactMethod: {
    type: String,
    enum: ['whatsapp', 'messenger', 'phone', 'email', 'other'],
    default: 'whatsapp'
  },
  customerLocation: {
    type: String,
    trim: true,
    maxlength: [100, 'موقع العميل لا يجب أن يتجاوز 100 حرف']
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'ملاحظات الإدارة لا يجب أن تتجاوز 500 حرف']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for customer photo URL
reviewSchema.virtual('customerPhotoUrl').get(function() {
  return this.customerPhoto && this.customerPhoto.filename 
    ? `/uploads/${this.customerPhoto.filename}` 
    : null;
});

// Virtual for display name (mask full name for privacy)
reviewSchema.virtual('displayName').get(function() {
  if (!this.name) return 'عميل مجهول';
  
  const nameParts = this.name.trim().split(' ');
  if (nameParts.length === 1) {
    // Single name: show first and last characters with dots
    const name = nameParts[0];
    if (name.length <= 2) return name;
    return `${name.charAt(0)}${'•'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
  } else {
    // Multiple names: show first name and first letter of last name
    return `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
  }
});

// Virtual for relative date
reviewSchema.virtual('relativeDate').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'منذ يوم واحد';
  if (diffDays <= 7) return `منذ ${diffDays} أيام`;
  if (diffDays <= 30) return `منذ ${Math.ceil(diffDays / 7)} أسبوع`;
  if (diffDays <= 365) return `منذ ${Math.ceil(diffDays / 30)} شهر`;
  return `منذ ${Math.ceil(diffDays / 365)} سنة`;
});

// Index for search and filtering
reviewSchema.index({ approved: 1, createdAt: -1 });
reviewSchema.index({ featured: 1, approved: 1 });
reviewSchema.index({ rating: 1, approved: 1 });
reviewSchema.index({ productId: 1, approved: 1 });
reviewSchema.index({ 
  name: 'text', 
  comment: 'text', 
  product: 'text' 
});

// Static method to get approved reviews
reviewSchema.statics.getApproved = function(limit = 10, skip = 0) {
  return this.find({ approved: true })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('productId', 'name category');
};

// Static method to get featured reviews
reviewSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ approved: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('productId', 'name category');
};

// Static method to get reviews by rating
reviewSchema.statics.getByRating = function(rating, limit = 10) {
  return this.find({ approved: true, rating: rating })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('productId', 'name category');
};

// Static method to get average rating
reviewSchema.statics.getAverageRating = function() {
  return this.aggregate([
    { $match: { approved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
};

// Static method to get product reviews
reviewSchema.statics.getProductReviews = function(productId, limit = 5) {
  return this.find({ 
    productId: productId, 
    approved: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to approve review
reviewSchema.methods.approve = function() {
  this.approved = true;
  return this.save();
};

// Instance method to feature review
reviewSchema.methods.feature = function() {
  this.featured = true;
  return this.save();
};

// Instance method to verify review
reviewSchema.methods.verify = function() {
  this.verified = true;
  return this.save();
};

// Pre-save middleware for data validation
reviewSchema.pre('save', function(next) {
  // Ensure rating is integer
  this.rating = Math.round(this.rating);
  
  // Clean up comment
  this.comment = this.comment.trim();
  
  // Auto-verify 5-star reviews (can be overridden)
  if (this.rating === 5 && this.isNew) {
    this.verified = true;
  }
  
  next();
});

module.exports = mongoose.model('Review', reviewSchema);