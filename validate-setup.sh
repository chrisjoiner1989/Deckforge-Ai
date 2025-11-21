#!/bin/bash

# Validation script for Firebase setup
echo "🔍 Validating Firebase Backend Setup..."
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# 1. Check .env file
echo "1️⃣  Checking .env configuration..."
if node check-firebase-config.cjs 2>&1 | grep -q "All Firebase credentials are configured"; then
    echo -e "${GREEN}   ✅ .env file properly configured${NC}"
else
    echo -e "${RED}   ❌ .env file has issues${NC}"
    ((ERRORS++))
fi
echo ""

# 2. Check Firebase connection
echo "2️⃣  Checking Firebase CLI..."
if firebase projects:list 2>&1 | grep -q "dekforge-deckbuilder"; then
    echo -e "${GREEN}   ✅ Firebase CLI connected to project${NC}"
else
    echo -e "${RED}   ❌ Firebase CLI not connected${NC}"
    ((ERRORS++))
fi
echo ""

# 3. Check Firestore rules
echo "3️⃣  Checking Firestore setup..."
if [ -f "firestore.rules" ]; then
    echo -e "${GREEN}   ✅ Firestore rules file exists${NC}"
else
    echo -e "${RED}   ❌ Firestore rules file missing${NC}"
    ((ERRORS++))
fi
echo ""

# 4. Check required files
echo "4️⃣  Checking project files..."
FILES=("firebase.json" ".firebaserc" "firestore.rules" "storage.rules")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✅ $file${NC}"
    else
        echo -e "${YELLOW}   ⚠️  $file missing${NC}"
        ((WARNINGS++))
    fi
done
echo ""

# 5. Check node_modules
echo "5️⃣  Checking dependencies..."
if [ -d "node_modules" ] && [ -f "node_modules/firebase/package.json" ]; then
    echo -e "${GREEN}   ✅ Firebase SDK installed${NC}"
else
    echo -e "${RED}   ❌ Dependencies not installed (run: npm install)${NC}"
    ((ERRORS++))
fi
echo ""

# Summary
echo "📋 Validation Summary"
echo "===================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! Your Firebase backend is fully configured!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Enable Email/Password auth in Firebase Console"
    echo "   👉 https://console.firebase.google.com/project/dekforge-deckbuilder/authentication/providers"
    echo ""
    echo "2. Start your dev server:"
    echo "   npm run dev"
    echo ""
    echo "3. Test at: http://localhost:5173/auth"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Setup is mostly complete with $WARNINGS warning(s)${NC}"
    echo ""
    echo "Your app should work, but review the warnings above."
else
    echo -e "${RED}❌ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    exit 1
fi
