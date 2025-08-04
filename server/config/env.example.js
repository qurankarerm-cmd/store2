// Environment Variables Configuration
// Copy this file to .env in the server directory and update the values

module.exports = {
  // MongoDB Configuration
  MONGODB_URI: 'mongodb://localhost:27017/arabic-clay-store',

  // JWT Configuration
  JWT_SECRET: 'your-super-secret-jwt-key-here-change-this-in-production',
  JWT_EXPIRE: '7d',

  // Server Configuration
  NODE_ENV: 'development',
  PORT: 5000,

  // Client URLs (for CORS)
  CLIENT_URL: 'http://localhost:3000',
  ADMIN_URL: 'http://localhost:3001',

  // WhatsApp Configuration
  WHATSAPP_NUMBER: '201234567890',

  // Social Media Links
  FACEBOOK_PAGE: 'amali.bilteen',
  INSTAGRAM_USERNAME: 'amali_bilteen',
  TIKTOK_USERNAME: 'amali.bilteen',
  FACEBOOK_MESSENGER: 'amali.bilteen',

  // File Upload Configuration
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_FILE_TYPES: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',

  // Email Configuration (Optional - for future features)
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_USER: 'your-email@gmail.com',
  SMTP_PASS: 'your-app-password',

  // Analytics (Optional - for future features)
  GOOGLE_ANALYTICS_ID: 'UA-XXXXXXXXX-X',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Session Configuration
  SESSION_SECRET: 'your-session-secret-here-change-this-in-production',
  COOKIE_SECURE: false,
  COOKIE_SAME_SITE: 'strict'
};