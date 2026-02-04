# Auth Work Log (BlokC)

## Summary of work completed
- Auth UI: Login + Signup screens built in `src/features/auth/screens`.
- Shared auth UI: `AuthBackground`, `AuthTextInput`, success/fail modals.
- Forgot password flow: modal + “check your email” success state.
- Firebase email/password wired for login + signup.
- Google sign‑in wired (Expo Go + AuthSession).
- Navigation stack configured for Login/Signup.
- Assets in `src/assets` (blobs, dots, mascot).

## Files added/updated (key)
- `src/features/auth/screens/LoginScreen.tsx`
- `src/features/auth/screens/SignupScreen.tsx`
- `src/features/auth/components/AuthBackground.tsx`
- `src/features/auth/components/AuthTextInput.tsx`
- `src/features/auth/components/ForgotPasswordModal.tsx`
- `src/features/auth/components/AuthSuccessModal.tsx`
- `src/features/auth/config/authBackground.ts`
- `src/services/firebase.ts`
- `src/navigation/types.ts`
- `App.tsx`
- `app.config.js`

## Dependencies added
- `firebase`
- `expo-auth-session`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `expo-font`
- `@expo-google-fonts/inter`
- `expo-linear-gradient` (older blob setup; currently using image blobs)

## Setup for new developers
1) Install dependencies:
```
npm install
```

2) Start the app:
```
npx expo start
```

3) Firebase config:
- `src/services/firebase.ts` contains Firebase Web config.
- Email/password auth must be enabled in Firebase Console.

4) Google sign‑in (Expo Go):
- Enable Google provider in Firebase Auth.
- Configure Google OAuth consent screen.
- Add your Expo redirect URI in Google Cloud:
  `https://auth.expo.io/@YOUR_EXPO_USERNAME/blokc`

## Notes
- For Expo Go, native config files (`GoogleService-Info.plist`, `google-services.json`)
  are not used.
- For production/dev builds, those files will be needed.
