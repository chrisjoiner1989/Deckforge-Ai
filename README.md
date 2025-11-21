# Grimoire - MTG Deckbuilder

A modern Magic: The Gathering deck building application with AI-powered analysis, built with React, Firebase, and the Scryfall API.

## Features

- 🎴 **Deck Management**: Create, edit, and organize your MTG decks
- 🔍 **Card Search**: Search through the entire Scryfall database
- 🤖 **AI Analysis**: Get intelligent deck recommendations and synergy insights
- 🔐 **Authentication**: Email/password and OAuth (Google, Apple, Facebook)
- 📊 **Statistics**: Mana curve visualization, color distribution, and deck stats
- 💾 **Cloud Sync**: Your decks are securely saved to Firebase

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Firebase project ([Create one here](https://console.firebase.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mtg-deckbuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase credentials from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your apps:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firebase security rules**

   Deploy the security rules to protect your database:
   ```bash
   # Install Firebase CLI if you haven't already
   npm install -g firebase-tools

   # Login to Firebase
   firebase login

   # Initialize Firebase in your project
   firebase init

   # Select Firestore and Storage
   # Use existing project
   # Use firestore.rules and storage.rules files

   # Deploy security rules
   firebase deploy --only firestore:rules,storage:rules
   ```

5. **Enable authentication providers**

   In [Firebase Console](https://console.firebase.google.com/) → Authentication → Sign-in method, enable:
   - ✅ Email/Password
   - ✅ Google (optional)
   - ✅ Apple (optional, requires Apple Developer account)
   - ✅ Facebook (optional, requires Facebook App)

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Security

### API Keys & Environment Variables

**⚠️ IMPORTANT**: The Firebase API key in your client-side code is **safe to expose**. Here's why:

- Firebase API keys are **not secret** - they identify your Firebase project, not authenticate users
- Security is enforced by **Firestore Security Rules** and **Firebase Authentication**
- The API key is only used to communicate with Firebase; it doesn't grant access to data
- Real security comes from your `firestore.rules` file

**What IS protected:**
- ✅ `.env` file is gitignored - never committed to version control
- ✅ Firestore security rules restrict data access to authenticated users only
- ✅ Users can only read/write their own data
- ✅ Input validation on all Firestore writes

**Read more:**
- [Is it safe to expose Firebase API keys?](https://firebase.google.com/docs/projects/api-keys)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

### Firestore Security Rules

The `firestore.rules` file protects your database:

```javascript
// Users can only access their own data
match /users/{userId}/decks/{deckId} {
  allow read, write: if request.auth.uid == userId;
}
```

**What's protected:**
- ✅ Users can only read their own decks
- ✅ Users can only create/update/delete their own decks
- ✅ Input validation on card quantities (1-100)
- ✅ Deck name length limits (1-100 characters)
- ✅ All other access denied by default

### Best Practices Implemented

1. **Authentication**
   - Email/password with minimum 6-character requirement
   - OAuth with account collision handling
   - User sessions managed by Firebase Auth

2. **Data Validation**
   - Client-side validation before database writes
   - Server-side validation via Firestore rules
   - Type checking on all user inputs

3. **Error Handling**
   - User-friendly error messages
   - Detailed console logging for debugging
   - Toast notifications for all operations

4. **HTTPS Only**
   - Firebase enforces HTTPS for all connections
   - No sensitive data transmitted in plain text

## Project Structure

```
mtg-deckbuilder/
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ui/           # shadcn/ui components
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── DeckContext.jsx
│   ├── screens/          # Page components
│   │   ├── Auth.jsx
│   │   ├── DeckList.jsx
│   │   ├── DeckBuilder.jsx
│   │   ├── CardSearch.jsx
│   │   ├── Profile.jsx
│   │   └── Home.jsx
│   ├── services/         # API and Firebase services
│   │   ├── firebase.js   # Firebase initialization
│   │   ├── firestore.js  # Database operations
│   │   ├── scryfall.js   # Scryfall API
│   │   └── ai.js         # AI analysis
│   └── App.jsx
├── firestore.rules       # Database security rules
├── storage.rules         # Storage security rules
└── .env                  # Environment variables (gitignored)
```

## Technologies Used

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **APIs**: Scryfall (card data), OpenAI (deck analysis)
- **Icons**: Lucide React, React Icons
- **UI**: shadcn/ui components
- **Notifications**: Sonner (toast)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New authentication provider**
   - Add provider in `src/context/AuthContext.jsx`
   - Update UI in `src/screens/Auth.jsx`
   - Enable in Firebase Console

2. **New Firestore collection**
   - Add CRUD functions in `src/services/firestore.js`
   - Update `firestore.rules` with security rules
   - Deploy rules: `firebase deploy --only firestore:rules`

3. **New API integration**
   - Create service file in `src/services/`
   - Add environment variables to `.env` and `.env.example`
   - Document in this README

## Deployment

### Deploy to Firebase Hosting

```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Don't forget to:**
- Set environment variables in your hosting platform
- Deploy Firestore security rules
- Configure authorized domains in Firebase Console

## Common Issues

### "Permission denied" errors
- **Cause**: Firestore security rules not deployed
- **Fix**: Run `firebase deploy --only firestore:rules`

### OAuth popup blocked
- **Cause**: Browser blocking popups
- **Fix**: User must allow popups for your domain

### "Firebase: Error (auth/operation-not-allowed)"
- **Cause**: Auth provider not enabled in Firebase Console
- **Fix**: Enable the provider in Firebase Console → Authentication

### Cards not loading
- **Cause**: Scryfall API rate limiting or network issue
- **Fix**: Wait a moment and try again; Scryfall is free but rate-limited

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Scryfall](https://scryfall.com/) for the amazing MTG card database API
- [Firebase](https://firebase.google.com/) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- The MTG community for inspiration

---

**Built with ❤️ for the Magic: The Gathering community**
