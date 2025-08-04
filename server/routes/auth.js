const express = require('express');
const AdminUser = require('../models/AdminUser');
const { auth, authRateLimit, generateToken, validateAdminSetup } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/setup
// @desc    Initial admin setup
// @access  Public (only if no admin exists)
router.post('/setup', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if admin already exists
    const adminExists = await AdminUser.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin setup already completed'
      });
    }

    // Validation
    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Create admin user
    const admin = new AdminUser({
      username,
      email,
      password,
      fullName,
      role: 'admin',
      active: true
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Admin setup completed successfully',
      data: {
        user: admin,
        token
      }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field === 'username' ? 'Username' : 'Email'} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error during admin setup'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [validateAdminSetup, authRateLimit], async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user and check password
    const user = await AdminUser.findByCredentials(username, password);

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid credentials'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Admin logout
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a stateless JWT system, logout is mainly client-side
    // Here we could add token to a blacklist if needed
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user information'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email, preferences } = req.body;
    const updates = {};

    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await AdminUser.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await AdminUser.findById(req.user._id);

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token'
    });
  }
});

// @route   GET /api/auth/check-setup
// @desc    Check if admin setup is required
// @access  Public
router.get('/check-setup', async (req, res) => {
  try {
    const adminExists = await AdminUser.findOne({ role: 'admin', active: true });
    
    res.json({
      success: true,
      data: {
        setupRequired: !adminExists,
        hasAdmin: !!adminExists
      }
    });
  } catch (error) {
    console.error('Setup check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking setup status'
    });
  }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics (admin only)
// @access  Private
router.get('/stats', [auth], async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const stats = await AdminUser.getStats();
    
    res.json({
      success: true,
      data: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        recentLogins: 0
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user statistics'
    });
  }
});

module.exports = router;