#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌟 مرحباً بك في إعداد متجر أعمالي بالطين! 🌟');
console.log('Arabic Polymer Clay Store Setup\n');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const step = (message) => {
  log(`\n🔄 ${message}`, 'cyan');
};

const success = (message) => {
  log(`✅ ${message}`, 'green');
};

const error = (message) => {
  log(`❌ ${message}`, 'red');
};

const warning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

const info = (message) => {
  log(`ℹ️  ${message}`, 'blue');
};

// Check if a command exists
const commandExists = (command) => {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Execute command with output
const exec = (command, cwd = '.') => {
  try {
    return execSync(command, { 
      cwd, 
      stdio: 'inherit',
      encoding: 'utf8' 
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}`);
  }
};

// Check prerequisites
const checkPrerequisites = () => {
  step('Checking prerequisites...');
  
  const requirements = [
    { name: 'Node.js', command: 'node', version: '--version' },
    { name: 'npm', command: 'npm', version: '--version' },
    { name: 'MongoDB', command: 'mongod', version: '--version' }
  ];

  let allGood = true;

  requirements.forEach(req => {
    if (commandExists(req.command)) {
      try {
        const version = execSync(`${req.command} ${req.version}`, { encoding: 'utf8' }).trim();
        success(`${req.name}: ${version}`);
      } catch (e) {
        success(`${req.name}: Installed`);
      }
    } else {
      error(`${req.name}: Not found`);
      allGood = false;
    }
  });

  if (!allGood) {
    error('Please install missing prerequisites before continuing.');
    process.exit(1);
  }

  success('All prerequisites are installed!');
};

// Install dependencies
const installDependencies = () => {
  step('Installing dependencies...');

  // Root dependencies
  info('Installing root dependencies...');
  exec('npm install');

  // Server dependencies
  info('Installing server dependencies...');
  exec('npm install', 'server');

  // Client dependencies
  info('Installing client dependencies...');
  exec('npm install', 'client');

  // Admin dashboard dependencies
  info('Installing admin dashboard dependencies...');
  exec('npm install', 'admin-dashboard');

  success('All dependencies installed successfully!');
};

// Create environment file
const createEnvironmentFile = () => {
  step('Creating environment file...');

  const envPath = path.join(__dirname, 'server', '.env');
  const envExamplePath = path.join(__dirname, 'server', 'config', 'env.example.js');

  if (fs.existsSync(envPath)) {
    warning('Environment file already exists, skipping...');
    return;
  }

  // Read the example file and convert to .env format
  const envExample = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/arabic-clay-store

# JWT Configuration
JWT_SECRET=super-secret-key-change-this-in-production-arabic-clay-store-2024
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=development
PORT=5000

# Client URLs (for CORS)
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# WhatsApp Configuration
WHATSAPP_NUMBER=201234567890

# Social Media Links
FACEBOOK_PAGE=amali.bilteen
INSTAGRAM_USERNAME=amali_bilteen
TIKTOK_USERNAME=amali.bilteen
FACEBOOK_MESSENGER=amali.bilteen

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
`;

  fs.writeFileSync(envPath, envExample);
  success('Environment file created at server/.env');
  warning('Please update the environment variables with your actual values!');
};

// Create uploads directory
const createDirectories = () => {
  step('Creating necessary directories...');

  const uploadsDir = path.join(__dirname, 'server', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    success('Created uploads directory');
  } else {
    info('Uploads directory already exists');
  }
};

// Seed database
const seedDatabase = async () => {
  step('Seeding database with sample data...');
  
  try {
    exec('npm run seed', 'server');
    success('Database seeded successfully!');
  } catch (error) {
    warning('Could not seed database. Make sure MongoDB is running.');
    info('You can seed the database later by running: cd server && npm run seed');
  }
};

// Display final instructions
const displayInstructions = () => {
  log('\n🎉 Setup completed successfully! 🎉\n', 'green');
  
  log('📋 Next Steps:', 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  
  info('1. Make sure MongoDB is running:');
  log('   mongod', 'cyan');
  
  info('\n2. Update your environment variables in server/.env:');
  log('   - Change JWT_SECRET to a random secure value', 'yellow');
  log('   - Update WHATSAPP_NUMBER with your actual WhatsApp number', 'yellow');
  log('   - Update social media usernames', 'yellow');
  
  info('\n3. Start all services:');
  log('   npm run dev', 'cyan');
  
  info('\n4. Or start each service individually:');
  log('   # Server (API)', 'magenta');
  log('   cd server && npm run dev', 'cyan');
  log('   # Client (Public Website)', 'magenta');
  log('   cd client && npm run dev', 'cyan');
  log('   # Admin Dashboard', 'magenta');
  log('   cd admin-dashboard && npm run dev', 'cyan');
  
  info('\n5. Access the applications:');
  log('   🌐 Public Website: http://localhost:3000', 'green');
  log('   🔧 Admin Dashboard: http://localhost:3001', 'green');
  log('   🔌 API Server: http://localhost:5000', 'green');
  
  info('\n6. Default admin credentials (change after first login):');
  log('   Username: admin', 'yellow');
  log('   Password: admin123', 'yellow');
  
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('📚 For detailed documentation, check README.md', 'bright');
  log('🐛 For issues, please check the troubleshooting section in README.md', 'bright');
  log('\n🚀 Happy selling! بالتوفيق! 🚀\n', 'green');
};

// Main setup function
const main = async () => {
  try {
    log('Starting setup process...\n', 'bright');
    
    checkPrerequisites();
    installDependencies();
    createEnvironmentFile();
    createDirectories();
    await seedDatabase();
    displayInstructions();
    
  } catch (error) {
    error(`Setup failed: ${error.message}`);
    log('\n💡 Troubleshooting tips:', 'yellow');
    log('• Make sure you have Node.js 16+ installed');
    log('• Ensure MongoDB is installed and running');
    log('• Check your internet connection for downloading dependencies');
    log('• Try running individual commands manually');
    log('\nFor more help, check the README.md file');
    process.exit(1);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n\n⚠️  Setup interrupted by user', 'yellow');
  log('You can run the setup again anytime with: node setup.js');
  process.exit(0);
});

// Run setup
if (require.main === module) {
  main();
}

module.exports = { main };