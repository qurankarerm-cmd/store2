const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'arabic-clay-store',
      audience: 'admin-dashboard'
    }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
};

// Auth middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await AdminUser.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid - user not found'
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is temporarily locked'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Permission middleware
const authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied - not authenticated'
      });
    }

    // Admin role has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has required permissions
    const hasPermission = permissions.some(permission => {
      const [resource, action] = permission.split(':');
      return req.user.hasPermission(resource, action);
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - insufficient permissions',
        required: permissions,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Rate limiting for auth endpoints
const authRateLimit = (req, res, next) => {
  // This is a simple in-memory rate limiter
  // In production, use Redis or a proper rate limiting service
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  if (!req.rateLimit) {
    req.rateLimit = new Map();
  }
  
  const key = req.ip;
  const now = Date.now();
  const userAttempts = req.rateLimit.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > userAttempts.resetTime) {
    userAttempts.count = 0;
    userAttempts.resetTime = now + windowMs;
  }
  
  if (userAttempts.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts, please try again later',
      retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
    });
  }
  
  userAttempts.count++;
  req.rateLimit.set(key, userAttempts);
  
  next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await AdminUser.findById(decoded.userId).select('-password');
      
      if (user && user.active && !user.isLocked) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on auth error, just continue without user
    next();
  }
};

// Validate admin setup
const validateAdminSetup = async (req, res, next) => {
  try {
    const adminCount = await AdminUser.countDocuments({ role: 'admin', active: true });
    
    if (adminCount === 0) {
      return res.status(503).json({
        success: false,
        message: 'Admin setup required',
        needsSetup: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin setup validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin validation'
    });
  }
};

module.exports = {
  auth,
  authorize,
  authRateLimit,
  optionalAuth,
  validateAdminSetup,
  generateToken,
  verifyToken
};