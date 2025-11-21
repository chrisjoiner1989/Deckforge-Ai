#!/usr/bin/env node

// Quick script to verify Firebase config
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Firebase Configuration...\n');

// Check .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('   Run: cp .env.example .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^VITE_FIREBASE_(\w+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].trim();
  }
});

console.log('📋 Firebase Environment Variables:\n');

const requiredVars = [
  'API_KEY',
  'AUTH_DOMAIN',
  'PROJECT_ID',
  'STORAGE_BUCKET',
  'MESSAGING_SENDER_ID',
  'APP_ID'
];

let allValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  const isValid = value && value.length > 0 && !value.includes('your_') && !value.includes('_here');

  console.log(`${isValid ? '✅' : '❌'} VITE_FIREBASE_${varName}${isValid ? '' : ' (missing or placeholder)'}`);

  if (!isValid) allValid = false;
});

console.log('\n');

if (!allValid) {
  console.log('⚠️  Some Firebase credentials are missing or using placeholders');
  console.log('\n📝 To fix:');
  console.log('   1. Go to https://console.firebase.google.com/project/dekforge-deckbuilder/settings/general');
  console.log('   2. Scroll to "Your apps" section');
  console.log('   3. If no web app exists, click "Add app" and select Web (</>)');
  console.log('   4. Copy the config values to your .env file');
  console.log('   5. Restart your dev server: npm run dev\n');
  process.exit(1);
}

console.log('✅ All Firebase credentials are configured!');
console.log('\n🎉 You\'re ready to run: npm run dev\n');
