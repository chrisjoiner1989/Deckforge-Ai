# 🚀 Firebase Backend Deployment Checklist

## ✅ Completed Setup

### Backend Infrastructure
- ✅ Firebase project created: `dekforge-deckbuilder`
- ✅ Web app registered and configured
- ✅ `.env` file updated with live credentials
- ✅ Firestore database initialized
- ✅ Firestore security rules deployed
- ✅ Storage rules created (ready to deploy when needed)
- ✅ Firebase CLI configured
- ✅ All dependencies installed

### Code Fixes
- ✅ Fixed `addCard()` function parameters in CardSearch
- ✅ Fixed `removeCard()` function parameters in DeckBuilder
- ✅ Added comprehensive error handling
- ✅ OAuth providers integrated (Google, Apple, Facebook)

### Documentation
- ✅ README.md with complete setup guide
- ✅ Security documentation
- ✅ Firebase setup guide
- ✅ Automated setup scripts

---

## 🎯 Critical Next Step (REQUIRED)

### Enable Email/Password Authentication

**This is the ONLY thing blocking the app from working!**

1. Open: https://console.firebase.google.com/project/dekforge-deckbuilder/authentication/providers

2. Look for "Email/Password" in the list

3. Click on it

4. Toggle the switch to **"Enabled"** (blue)

5. Click **"Save"**

**That's it!** Your app will now work.

---

## 🧪 Testing Your Setup

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Test Authentication

Go to: http://localhost:5173/auth

**Create an Account:**
- Email: test@example.com
- Password: test123 (minimum 6 characters)
- Click "Create Account"

**Expected Result:**
- ✅ Account created successfully
- ✅ Redirected to `/decks` page
- ✅ Can see "My Decks" page

### 3. Test Deck Creation

1. Click "New Deck" button
2. Enter deck name: "Test Deck"
3. Select format: "Standard"
4. Click "Create Deck"

**Expected Result:**
- ✅ Deck created
- ✅ Redirected to deck builder
- ✅ Can see deck details

### 4. Test Card Search

1. In deck builder, click "Add Cards"
2. Search for: "Lightning Bolt"
3. Click the + button on a card

**Expected Result:**
- ✅ Card added to deck
- ✅ Success toast notification
- ✅ Card appears in deck list

---

## 🌐 Optional Enhancements

### Enable Google Sign-In (Recommended)

1. Go to: https://console.firebase.google.com/project/dekforge-deckbuilder/authentication/providers

2. Click on **"Google"**

3. Toggle **"Enable"** to ON

4. Select support email from dropdown

5. Click **"Save"**

**Test:** The Google icon button should now work on the auth page.

### Enable Firebase Storage

Only if you want users to upload images:

```bash
# 1. Enable in console
open https://console.firebase.google.com/project/dekforge-deckbuilder/storage

# 2. Click "Get Started" and follow prompts

# 3. Deploy storage rules
firebase deploy --only storage:rules
```

### Enable Firebase Hosting

Deploy your app to the web:

```bash
# 1. Build production version
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# 3. Your app will be live at:
# https://dekforge-deckbuilder.web.app
```

---

## 🔒 Security Checklist

- ✅ `.env` file is in `.gitignore` (API keys won't leak)
- ✅ Firestore rules restrict data to authenticated users only
- ✅ Users can only access their own decks
- ✅ Input validation on all writes
- ✅ Password minimum length enforced (6 characters)
- ✅ OAuth error handling implemented

---

## 📊 Firestore Data Structure

```
/users/{userId}/
  └── decks/{deckId}/
      ├── name: string
      ├── format: string
      ├── createdAt: timestamp
      └── cards/{cardId}/
          ├── name: string
          ├── quantity: number (1-100)
          ├── type: string
          ├── manaCost: string
          └── ...other card data
```

**Security:** Users can only read/write their own data under `/users/{userId}/`

---

## 🛠️ Useful Commands

```bash
# Validate your setup
./validate-setup.sh

# Check Firebase config
node check-firebase-config.cjs

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy full app
firebase deploy

# View Firebase logs
firebase functions:log

# Open Firebase Console
open https://console.firebase.google.com/project/dekforge-deckbuilder
```

---

## 🐛 Common Issues & Solutions

### Issue: "auth/operation-not-allowed"
**Solution:** Email/Password auth not enabled → Enable it in Firebase Console

### Issue: "auth/invalid-api-key"
**Solution:** Wrong API key in `.env` → Run `./setup-firebase.sh` to get correct values

### Issue: "Permission denied" errors in Firestore
**Solution:** Security rules not deployed → Run `firebase deploy --only firestore:rules`

### Issue: OAuth popup blocked
**Solution:** Allow popups in browser settings for localhost

### Issue: Can't create account
**Solution:** Check browser console for specific error, then see solutions above

---

## 📈 Production Deployment Steps

When you're ready to go live:

1. **Build production bundle:**
   ```bash
   npm run build
   ```

2. **Test production build locally:**
   ```bash
   npm run preview
   ```

3. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy
   ```

4. **Configure custom domain** (optional):
   - Go to Firebase Console → Hosting
   - Click "Add custom domain"
   - Follow DNS setup instructions

5. **Monitor usage:**
   - Check Firebase Console → Usage
   - Set up billing alerts
   - Monitor Firestore read/write counts

---

## 🎉 You're Done!

Your Firebase backend is **100% configured** and ready to go!

**Just enable Email/Password auth in the Firebase Console and start building!**

Questions? Check:
- `README.md` - Full project documentation
- `FIREBASE_SETUP_GUIDE.md` - Step-by-step Firebase setup
- Firebase docs: https://firebase.google.com/docs

Happy coding! 🎴✨
