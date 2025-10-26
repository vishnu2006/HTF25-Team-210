const fs = require('fs');

console.log('🔧 Setting up environment variables...');

try {
  // Copy config.env to .env
  if (fs.existsSync('config.env')) {
    fs.copyFileSync('config.env', '.env');
    console.log('✅ Environment variables configured successfully!');
    console.log('📋 Your API keys have been added:');
    console.log('   - Gemini API: AIzaSyBnFn9dnDyLBEH2kO6ObDWne0-QD5MQsbA');
    console.log('   - Firebase Project: cosc-4aec4');
    console.log('   - Firebase Auth Domain: cosc-4aec4.firebaseapp.com');
  } else {
    console.log('❌ config.env file not found. Please check the file exists.');
  }
} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
}
