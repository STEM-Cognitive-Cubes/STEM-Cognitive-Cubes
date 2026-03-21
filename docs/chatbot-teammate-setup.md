# Chatbot Teammate Setup

This guide is for teammates who pull `feature/bot-screen-finalized` and need to run or rebuild the chatbot safely.

## What this branch includes
- The in-app chatbot UI
- Firebase Functions backend for `chatbot` and `chatbotHistory`
- Firestore-backed chat history and product knowledge
- Gemini as the model provider
- Hosted Firebase deployment support for phone testing through EAS

## Prerequisites
- Node.js 20
- `npm`
- Access to Firebase project `blokc-13a99`
- Access to the Gemini key or permission to reuse the existing Firebase secret
- If building Android natively, the real Firebase Android config file for `com.blokc.app`

## Branch
```powershell
git fetch origin
git switch feature/bot-screen-finalized
npm install
npm run functions:install
```

## Firebase and Gemini setup
If Firebase CLI is not installed globally, use `npx firebase-tools ...`.

Login if needed:

```powershell
npx firebase-tools login
```

Set the Gemini key only if it does not already exist in project `blokc-13a99`:

```powershell
npx firebase-tools functions:secrets:set GEMINI_API_KEY
npx firebase-tools functions:secrets:set GEMINI_MODEL
```

Suggested model:

```text
gemini-2.5-flash
```

Quick check:

```powershell
npx firebase-tools functions:secrets:access GEMINI_MODEL
```

## Firestore seed data
Seed the chatbot knowledge documents once:

```powershell
npm run functions:seed-knowledge
```

## Option 1: Local backend testing
Use this when testing from a laptop or a phone on the same Wi-Fi.

Start the backend:

```powershell
npx firebase-tools emulators:start --only functions
```

Then start Expo in a second terminal.

Local machine or Android emulator:

```powershell
$env:API_BASE_URL="http://localhost:5001/blokc-13a99/us-central1"
npx expo start --clear
```

Physical phone:

```powershell
ipconfig
```

Use the Wi-Fi IPv4 address:

```powershell
$env:API_BASE_URL="http://YOUR_LOCAL_IP:5001/blokc-13a99/us-central1"
npx expo start --clear
```

Example:

```powershell
$env:API_BASE_URL="http://192.168.1.251:5001/blokc-13a99/us-central1"
```

## Option 2: Hosted backend plus EAS build
Use this for a proper phone build without keeping the Firebase emulator running.

### Deploy Firebase Functions
```powershell
npx firebase-tools deploy --only functions
```

Hosted base URL:

```text
https://us-central1-blokc-13a99.cloudfunctions.net
```

### Android Firebase config file
The Android build needs the real Firebase config file, not the example file.

Download `google-services.json` from Firebase Console for Android package:

```text
com.blokc.app
```

Place it here:

```text
android/app/google-services.json
```

### Build with EAS
```powershell
$env:API_BASE_URL="https://us-central1-blokc-13a99.cloudfunctions.net"
npx eas-cli build -p android --profile development
```

Install the generated APK or dev build on the phone and test. The chatbot should work without the local Firebase emulator.

## Important Android build notes
- `android/gradle.properties` uses `newArchEnabled=false` on this branch for EAS build compatibility.
- `.easignore` excludes local Android build artifacts and `.merge-test-worktree/` from EAS uploads.
- Do not use `google-services.json.example` for builds. It is only a placeholder.

## Expected working flow
1. Open the app.
2. Go to the home screen.
3. Tap the floating bot.
4. Skip or complete the intro if shown.
5. Send a message like `How do I connect to Hive?`
6. The bot should return a Gemini-generated answer.

## Common issues

### `The assistant server is not reachable from this device`
- Check `API_BASE_URL`
- Check phone and laptop Wi-Fi
- If using local backend, make sure Firebase Functions emulator is running

### `The assistant is unavailable right now`
- Check Firebase Functions logs
- Usually this means the provider request failed

### `Generative Language API ... is disabled`
- Enable:
  `https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=897405902939`

### `File google-services.json is missing`
- Download the real Android Firebase config from Firebase Console
- Put it in `android/app/google-services.json`

### `firebase is not recognized`
- Use:

```powershell
npx firebase-tools ...
```

## Main files
- `src/features/bot/screens/BotChatScreen.tsx`
- `src/features/bot/navigation/BotStack.tsx`
- `src/services/chatbot.ts`
- `functions/index.js`
- `functions/knowledgeSeedData.js`
- `docs/chatbot-backend.md`
