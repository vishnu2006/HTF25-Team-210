const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Document QA System...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies:', error.message);
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('\n📝 Creating .env file from config...');
  try {
    if (fs.existsSync('config.env')) {
      fs.copyFileSync('config.env', '.env');
      console.log('✅ .env file created with your API keys.');
    } else {
      fs.copyFileSync('env.example', '.env');
      console.log('✅ .env file created from template. Please edit it with your API keys.');
    }
  } catch (error) {
    console.log('⚠️  Could not create .env file. Please copy config.env to .env manually.');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your API keys');
console.log('2. Set up Firebase project and get API keys');
console.log('3. Get Gemini API key from Google AI Studio');
console.log('4. Start ChromaDB server (optional, will use local instance)');
console.log('5. Run "npm run dev" to start the development servers');
console.log('\n🔗 Useful links:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Google AI Studio: https://makersuite.google.com/');
console.log('- ChromaDB: https://docs.trychroma.com/');
