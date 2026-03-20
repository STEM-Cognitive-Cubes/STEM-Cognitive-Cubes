# Chatbot Teammate Setup

This guide is for teammates who pull `feature/bot-screen-finalized` and need to run the chatbot locally.

## What this setup gives you
- The existing mobile chatbot UI in the app
- A local Firebase Functions backend
- Firestore-backed chatbot history and product knowledge
- Gemini as the model provider

## Prerequisites
- Node.js 20 is recommended
- `npm`
- A Firebase login that can access project `blokc-13a99`
- A Google / Gemini API key with the Generative Language API enabled
- Phone and laptop on the same Wi-Fi if testing on a physical device

## Branch
Checkout the chatbot branch:

```powershell
git fetch origin
git switch feature/bot-screen-finalized
```

## Install dependencies
Project root:

```powershell
npm install
```

Functions dependencies:

```powershell
npm run functions:install
```

## Firebase login
If Firebase CLI is not installed globally, use `npx firebase-tools ...`.

Login if needed:

```powershell
npx firebase-tools login
```

## Gemini key setup
1. Open Vertex AI Studio / Google AI Studio.
2. Create or copy a Gemini API key.
3. Make sure `Generative Language API` is enabled for the Google project being used.

Store the key in Firebase Secret Manager:

```powershell
npx firebase-tools functions:secrets:set GEMINI_API_KEY
```

Set the model too:

```powershell
npx firebase-tools functions:secrets:set GEMINI_MODEL
```

Suggested value:

```text
gemini-2.5-flash
```

## Seed chatbot knowledge
Run:

```powershell
npm run functions:seed-knowledge
```

This creates the base `botKnowledge` documents in Firestore.

## Start the backend
Run the Firebase Functions emulator:

```powershell
npx firebase-tools emulators:start --only functions
```

Keep this terminal running.

## Start the app
Open a second terminal.

### If using Android emulator or local machine testing
Set:

```powershell
$env:API_BASE_URL="http://localhost:5001/blokc-13a99/us-central1"
```

Then run:

```powershell
npx expo start --clear
```

### If using a physical phone
Find your laptop IP:

```powershell
ipconfig
```

Use the Wi-Fi IPv4 address and set:

```powershell
$env:API_BASE_URL="http://YOUR_LOCAL_IP:5001/blokc-13a99/us-central1"
```

Example:

```powershell
$env:API_BASE_URL="http://192.168.1.251:5001/blokc-13a99/us-central1"
```

Then run:

```powershell
npx expo start --clear
```

## Important notes for phone testing
- The phone must be on the same Wi-Fi as the laptop.
- The Firebase emulator must still be running.
- Android local testing uses plain HTTP to the emulator.
- If native Android changes were pulled and not already built into the installed app, rebuild the Android app.

## Expected working flow
1. Open the app.
2. Go to the home screen.
3. Tap the floating bot.
4. Skip or complete the intro if shown.
5. Send a message like:

```text
How do I connect to Hive?
```

6. The bot should respond with a Gemini-generated answer.

## Common issues

### `The assistant server is not reachable from this device`
- Check `API_BASE_URL`
- Check phone/laptop Wi-Fi
- Check that the emulator is running
- Check that Firebase Functions is listening on `0.0.0.0:5001`

### `The assistant is unavailable right now`
- Check the Firebase emulator terminal
- Usually this means the provider request failed

### `Generative Language API ... is disabled`
- Enable it here:
  `https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=897405902939`

### `insufficient_quota` or billing errors
- The Gemini / Google project billing or quota is the blocker
- Fix that in Google Cloud before retesting

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
