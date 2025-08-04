import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance
const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle different error types
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      Cookies.remove('admin_token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Return standardized error
    const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  // Check if admin setup is required
  checkSetup: () => api.get('/auth/check-setup'),
  
  // Setup initial admin
  setup: (data) => api.post('/auth/setup', data),
  
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getProfile: () => api.get('/auth/me'),
  
  // Update profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Change password
  changePassword: (data) => api.put('/auth/password', data),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Get user stats
  getUserStats: () => api.get('/auth/stats'),
};

// Products API
export const productsAPI = {
  // Get all products (admin)
  getAll: (params = {}) => api.get('/products/admin/all', { params }),
  
  // Get single product
  getById: (id) => api.get(`/products/${id}`),
  
  // Create product
  create: (data) => api.post('/products', data),
  
  // Update product
  update: (id, data) => api.put(`/products/${id}`, data),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
  
  // Toggle featured status
  toggleFeatured: (id) => api.put(`/products/${id}/toggle-featured`),
  
  // Get product stats
  getStats: () => api.get('/products/admin/stats'),
  
  // Get categories
  getCategories: () => api.get('/products/categories'),
};

// Reviews API
export const reviewsAPI = {
  // Get all reviews (admin)
  getAll: (params = {}) => api.get('/reviews/admin/all', { params }),
  
  // Get pending reviews
  getPending: (params = {}) => api.get('/reviews/admin/pending', { params }),
  
  // Approve review
  approve: (id) => api.put(`/reviews/${id}/approve`),
  
  // Toggle featured status
  toggleFeatured: (id) => api.put(`/reviews/${id}/feature`),
  
  // Toggle verified status
  toggleVerified: (id) => api.put(`/reviews/${id}/verify`),
  
  // Update review
  update: (id, data) => api.put(`/reviews/${id}`, data),
  
  // Delete review
  delete: (id) => api.delete(`/reviews/${id}`),
  
  // Get review stats
  getStats: () => api.get('/reviews/admin/stats'),
};

// Upload API
export const uploadAPI = {
  // Upload single file
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Upload multiple files
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Upload product images
  uploadProductImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('productImages', file);
    });
    return api.post('/upload/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Delete file
  deleteFile: (filename) => api.delete(`/upload/${filename}`),
  
  // List files
  listFiles: () => api.get('/upload/list'),
  
  // Get file info
  getFileInfo: (filename) => api.get(`/upload/info/${filename}`),
};

// Utility functions
export const formatError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'حدث خطأ غير متوقع';
};

export const formatApiResponse = (response) => {
  if (response.success) {
    return response.data;
  }
  throw new Error(response.message || 'فشل في العملية');
};

// Token management
export const tokenManager = {
  get: () => Cookies.get('admin_token'),
  
  set: (token, options = {}) => {
    const defaultOptions = {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      ...options
    };
    Cookies.set('admin_token', token, defaultOptions);
  },
  
  remove: () => {
    Cookies.remove('admin_token');
  },
  
  isValid: () => {
    const token = tokenManager.get();
    if (!token) return false;
    
    try {
      // Basic JWT validation (check if not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },
};

// File upload helpers
export const fileHelpers = {
  // Validate image file
  validateImage: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('نوع الملف غير مدعوم. يرجى اختيار ملف صورة (JPEG, PNG, GIF, WebP)');
    }
    
    if (file.size > maxSize) {
      throw new Error('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت');
    }
    
    return true;
  },
  
  // Create image preview URL
  createPreviewUrl: (file) => {
    return URL.createObjectURL(file);
  },
  
  // Cleanup preview URL
  revokePreviewUrl: (url) => {
    URL.revokeObjectURL(url);
  },
  
  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

// Date helpers
export const dateHelpers = {
  // Format date for display
  formatDate: (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'منذ يوم واحد';
    if (diffDays <= 7) return `منذ ${diffDays} أيام`;
    if (diffDays <= 30) return `منذ ${Math.ceil(diffDays / 7)} أسبوع`;
    if (diffDays <= 365) return `منذ ${Math.ceil(diffDays / 30)} شهر`;
    
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // Format date and time
  formatDateTime: (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
};

export default api;