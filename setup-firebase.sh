#!/bin/bash

# Firebase Backend Setup Script
# This script helps you complete the Firebase backend setup

set -e

echo "🔥 Firebase Backend Setup for Grimoire MTG Deckbuilder"
echo "========================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not installed${NC}"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✅ Firebase CLI installed${NC}"

# Check if logged in
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Running: firebase login"
    firebase login
fi

echo -e "${GREEN}✅ Logged in to Firebase${NC}"

# Get current project
PROJECT_ID=$(firebase use 2>&1 | grep "Active Project" | awk '{print $3}' | tr -d '()')

if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID="dekforge-deckbuilder"
    firebase use "$PROJECT_ID" --add
fi

echo -e "${GREEN}✅ Using project: ${PROJECT_ID}${NC}"
echo ""

# Step 1: Check if web app exists
echo "📱 Step 1: Checking Web App Configuration..."
echo "-------------------------------------------"

# Try to get web app config
WEBAPP_CONFIG=$(firebase apps:sdkconfig WEB 2>&1 || echo "not_found")

if [[ "$WEBAPP_CONFIG" == *"not_found"* ]] || [[ "$WEBAPP_CONFIG" == *"No apps found"* ]]; then
    echo -e "${YELLOW}⚠️  No web app found. You need to create one.${NC}"
    echo ""
    echo "Please go to:"
    echo -e "${BLUE}https://console.firebase.google.com/project/${PROJECT_ID}/settings/general${NC}"
    echo ""
    echo "Then:"
    echo "1. Scroll to 'Your apps'"
    echo "2. Click the Web icon (</>) to add a web app"
    echo "3. Name it: 'Grimoire Web App'"
    echo "4. Click 'Register app'"
    echo "5. Copy the config and update your .env file"
    echo ""
    echo "After that, run this script again."
    exit 1
else
    echo -e "${GREEN}✅ Web app exists${NC}"
    echo ""
    echo "Copy these values to your .env file:"
    echo "------------------------------------"
    echo "$WEBAPP_CONFIG" | grep -E "(apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId)" | while read line; do
        key=$(echo "$line" | awk '{print $1}' | tr -d ':,"')
        value=$(echo "$line" | awk '{print $2}' | tr -d ',"')

        case $key in
            apiKey)
                echo "VITE_FIREBASE_API_KEY=$value"
                ;;
            authDomain)
                echo "VITE_FIREBASE_AUTH_DOMAIN=$value"
                ;;
            projectId)
                echo "VITE_FIREBASE_PROJECT_ID=$value"
                ;;
            storageBucket)
                echo "VITE_FIREBASE_STORAGE_BUCKET=$value"
                ;;
            messagingSenderId)
                echo "VITE_FIREBASE_MESSAGING_SENDER_ID=$value"
                ;;
            appId)
                echo "VITE_FIREBASE_APP_ID=$value"
                ;;
        esac
    done
    echo ""
fi

# Step 2: Deploy Firestore rules
echo "📜 Step 2: Deploying Firestore Security Rules..."
echo "------------------------------------------------"

if firebase deploy --only firestore:rules; then
    echo -e "${GREEN}✅ Firestore rules deployed${NC}"
else
    echo -e "${YELLOW}⚠️  Firestore rules deployment failed (may need to enable Firestore first)${NC}"
fi
echo ""

# Step 3: Enable Storage (optional)
echo "💾 Step 3: Firebase Storage..."
echo "------------------------------"

if firebase deploy --only storage:rules 2>&1 | grep -q "has not been set up"; then
    echo -e "${YELLOW}⚠️  Firebase Storage not enabled${NC}"
    echo ""
    echo "To enable Storage (optional):"
    echo -e "${BLUE}https://console.firebase.google.com/project/${PROJECT_ID}/storage${NC}"
    echo "Click 'Get Started' and follow the prompts"
else
    echo -e "${GREEN}✅ Storage rules deployed${NC}"
fi
echo ""

# Step 4: Authentication setup
echo "🔐 Step 4: Authentication Setup..."
echo "----------------------------------"
echo ""
echo "You need to manually enable these in Firebase Console:"
echo -e "${BLUE}https://console.firebase.google.com/project/${PROJECT_ID}/authentication/providers${NC}"
echo ""
echo "Enable the following sign-in methods:"
echo "  1. ✅ Email/Password - REQUIRED"
echo "  2. ⚪ Google - Optional (recommended)"
echo "  3. ⚪ Apple - Optional (requires Apple Developer account)"
echo "  4. ⚪ Facebook - Optional (requires Facebook App)"
echo ""

# Step 5: Verify .env
echo "🔍 Step 5: Verifying .env Configuration..."
echo "------------------------------------------"

if node check-firebase-config.cjs 2>&1 | grep -q "All Firebase credentials are configured"; then
    echo -e "${GREEN}✅ .env file is properly configured${NC}"
else
    echo -e "${YELLOW}⚠️  .env file needs to be updated${NC}"
    echo "Run: node check-firebase-config.cjs"
fi
echo ""

# Summary
echo "📋 Setup Summary"
echo "================"
echo ""
echo -e "${GREEN}✅ Completed:${NC}"
echo "  • Firebase CLI configured"
echo "  • Project selected: $PROJECT_ID"
echo "  • Firestore security rules deployed"
echo ""
echo -e "${YELLOW}⏳ Manual Steps Remaining:${NC}"
echo "  1. Update .env with Firebase config (see above)"
echo "  2. Enable Email/Password auth in Firebase Console"
echo "  3. (Optional) Enable OAuth providers"
echo "  4. (Optional) Enable Firebase Storage"
echo ""
echo "Once done, run:"
echo -e "${BLUE}  npm run dev${NC}"
echo ""
echo "🎉 Then test at: http://localhost:5173/auth"
