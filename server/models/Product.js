const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المنتج مطلوب'],
    trim: true,
    maxlength: [100, 'اسم المنتج لا يجب أن يتجاوز 100 حرف']
  },
  description: {
    type: String,
    required: [true, 'وصف المنتج مطلوب'],
    trim: true,
    maxlength: [1000, 'وصف المنتج لا يجب أن يتجاوز 1000 حرف']
  },
  price: {
    type: String,
    required: [true, 'سعر المنتج مطلوب'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'فئة المنتج مطلوبة'],
    enum: {
      values: ['ميداليات مفاتيح', 'ديكورات', 'أدوات مكتبية', 'أدوات مطبخ', 'إكسسوارات', 'أخرى'],
      message: 'فئة المنتج غير صحيحة'
    }
  },
  images: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  stock: {
    type: String,
    enum: ['متوفر', 'غير متوفر', 'حسب الطلب'],
    default: 'متوفر'
  },
  tags: [{
    type: String,
    trim: true
  }],
  customizable: {
    type: Boolean,
    default: true
  },
  minOrder: {
    type: Number,
    default: 1,
    min: [1, 'الحد الأدنى للطلب هو 1']
  },
  processingTime: {
    type: String,
    default: '3-7 أيام'
  },
  clickCount: {
    type: Number,
    default: 0
  },
  whatsappClicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual for image URLs
productSchema.virtual('imageUrls').get(function() {
  if (!this.images || this.images.length === 0) return [];
  return this.images.map(img => `/uploads/${img.filename}`);
});

// Index for search
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
}, {
  weights: {
    name: 10,
    category: 5,
    description: 3,
    tags: 2
  }
});

// Index for category and active status
productSchema.index({ category: 1, active: 1 });
productSchema.index({ featured: 1, active: 1 });
productSchema.index({ createdAt: -1 });

// Middleware to increment click count
productSchema.methods.incrementClickCount = function() {
  this.clickCount += 1;
  return this.save();
};

// Middleware to increment WhatsApp clicks
productSchema.methods.incrementWhatsAppClicks = function() {
  this.whatsappClicks += 1;
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true, active: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.searchProducts = function(query, category = null, limit = 20, skip = 0) {
  const searchQuery = { active: true };
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category && category !== 'الكل') {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery)
    .sort(query ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Pre-save middleware to ensure at least one image
productSchema.pre('save', function(next) {
  if (this.isNew && (!this.images || this.images.length === 0)) {
    const error = new Error('المنتج يجب أن يحتوي على صورة واحدة على الأقل');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);