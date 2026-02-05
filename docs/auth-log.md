# Auth Work Log (BlokC)

## Summary of work completed
- Auth UI: Login + Signup screens built in `src/features/auth/screens`.
- Shared auth UI: `AuthBackground`, `AuthTextInput`, success/fail modals.
- Forgot password flow: modal + "check your email" success state.
- Firebase email/password wired for login + signup.
- Google sign-in wired using native `@react-native-google-signin/google-signin` (EAS dev build required).
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
- `expo-dev-client`
- `@react-native-google-signin/google-signin`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `expo-font`
- `@expo-google-fonts/inter`
- `expo-linear-gradient` (older blob setup; currently using image blobs)

## Setup
See `docs/setup.md` for complete Windows/macOS setup, EAS dev build commands,
Firebase config files, and SHA-1 instructions.

## Notes
- Expo Go is not supported for native Google sign-in.
- Dev builds require `google-services.json` (Android) and `GoogleService-Info.plist` (iOS).
