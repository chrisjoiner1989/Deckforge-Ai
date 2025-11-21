# Firebase Backend Setup Guide

## ✅ What's Already Done

- ✅ Firebase project connected: `dekforge-deckbuilder`
- ✅ Firestore database created and secured with rules
- ✅ `.env` file updated with correct credentials
- ✅ Web app registered

## 🔐 Step 1: Enable Email/Password Authentication (REQUIRED)

**This is required for the app to work!**

1. Open this link: https://console.firebase.google.com/project/dekforge-deckbuilder/authentication/providers

2. If you see "Get Started", click it

3. Click on **"Email/Password"** in the list

4. Toggle **"Enable"** to ON (should turn blue)

5. Click **"Save"**

6. You should now see "Email/Password" with a green checkmark

## 🌐 Step 2: Enable OAuth Providers (Optional but Recommended)

### Google Sign-In

1. In the same page, click on **"Google"**
2. Toggle **"Enable"** to ON
3. Select a support email from the dropdown
4. Click **"Save"**

**That's it!** Google is the easiest OAuth provider.

### Apple Sign-In (Optional - Advanced)

⚠️ **Requires Apple Developer Account ($99/year)**

1. Click on **"Apple"**
2. Toggle **"Enable"** to ON
3. You'll need:
   - Service ID from Apple Developer Console
   - Apple Team ID
   - Private Key (.p8 file)
4. Follow the instructions in the Firebase Console
5. Click **"Save"**

### Facebook Login (Optional - Advanced)

⚠️ **Requires Facebook Developer Account (Free)**

1. Go to https://developers.facebook.com/ and create an app
2. Get your App ID and App Secret
3. Back in Firebase, click on **"Facebook"**
4. Toggle **"Enable"** to ON
5. Enter App ID and App Secret
6. Copy the OAuth redirect URI from Firebase
7. Add it to your Facebook App settings
8. Click **"Save"**

## 💾 Step 3: Enable Firebase Storage (Optional)

Only needed if you want users to upload custom card images.

1. Open: https://console.firebase.google.com/project/dekforge-deckbuilder/storage

2. Click **"Get Started"**

3. Choose **"Start in production mode"** (we have security rules ready)

4. Click **"Next"**

5. Select your region (e.g., `us-central1`)

6. Click **"Done"**

7. Deploy storage rules:
   ```bash
   firebase deploy --only storage:rules
   ```

## 🧪 Step 4: Test Your Setup

```bash
# Start the dev server
npm run dev
```

Then open http://localhost:5173/auth and try:

1. **Create Account** with email/password
2. **Sign In** with the account you created
3. **Try OAuth** (Google) if you enabled it

You should be redirected to `/decks` after signing in!

## 🚀 Step 5: Deploy to Firebase Hosting (Optional)

```bash
# Build the production app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your app will be live at: https://dekforge-deckbuilder.web.app

## ❓ Troubleshooting

### "auth/operation-not-allowed" error
- **Fix**: Email/Password auth not enabled in Firebase Console
- Go back to Step 1

### "auth/invalid-api-key" error
- **Fix**: Wrong API key in `.env`
- Run: `./setup-firebase.sh` to get correct values

### "Permission denied" in Firestore
- **Fix**: Security rules not deployed
- Run: `firebase deploy --only firestore:rules`

### OAuth popup blocked
- **Fix**: Allow popups in your browser for localhost

### Cards not saving
- **Fix**: Check browser console for errors
- Make sure you're signed in
- Check Firestore security rules are deployed

## 📚 Useful Links

- **Firebase Console**: https://console.firebase.google.com/project/dekforge-deckbuilder
- **Authentication**: https://console.firebase.google.com/project/dekforge-deckbuilder/authentication
- **Firestore Database**: https://console.firebase.google.com/project/dekforge-deckbuilder/firestore
- **Storage**: https://console.firebase.google.com/project/dekforge-deckbuilder/storage
- **Hosting**: https://console.firebase.google.com/project/dekforge-deckbuilder/hosting

---

**Need Help?** Check the README.md or Firebase documentation.
