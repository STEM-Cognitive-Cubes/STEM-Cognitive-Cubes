# Chatbot Backend

## Architecture
- React Native app sends chatbot messages to a Firebase HTTPS function.
- React Native app can also fetch the latest stored chatbot history from Firebase.
- The app includes the signed-in user's Firebase ID token in the `Authorization` header.
- The Firebase function verifies the user, loads product knowledge from Firestore, calls the model API, and stores messages back in Firestore.
- Gemini API keys stay on the server side only.

## Firestore shape
- `users/{uid}/chatConversations/{conversationId}`
- `users/{uid}/chatConversations/{conversationId}/messages/{messageId}`
- `botKnowledge/{docId}`

Conversation metadata stored on `chatConversations` now includes:
- `title`
- `createdAt`
- `updatedAt`
- `messageCount`
- `lastUserMessage`
- `lastAssistantMessage`

Suggested `botKnowledge` document shape:

```json
{
  "title": "Hive connectivity",
  "content": "Explain how parents connect Hive, what to check if a session does not start, and what the expected in-app flow looks like.",
  "keywords": ["hive", "connect", "session", "device"]
}
```

## Local setup
1. Install function dependencies:
   `npm --prefix functions install`
2. Set the Gemini secret in Firebase:
   `npx firebase-tools functions:secrets:set GEMINI_API_KEY`
   Get the Gemini API key from Vertex AI Studio / Google AI Studio before running this command.
3. Optional model override:
   `npx firebase-tools functions:secrets:set GEMINI_MODEL`
4. Seed the base product knowledge:
   `npm run functions:seed-knowledge`
5. Run the functions emulator:
   `npx firebase-tools emulators:start --only functions`
6. Set `API_BASE_URL` for Expo.

For local emulation, `API_BASE_URL` should point to:

```env
API_BASE_URL=http://localhost:5001/blokc-13a99/us-central1
```

For a physical Android device, `localhost` will not work. Use your machine IP instead.

## Deployment
- Deploy all functions:
  `npx firebase-tools deploy --only functions`
- The hosted function base URL is:

```text
https://us-central1-blokc-13a99.cloudfunctions.net
```

- Build the app against that hosted backend:

```powershell
$env:API_BASE_URL="https://us-central1-blokc-13a99.cloudfunctions.net"
npx eas-cli build -p android --profile development
```

- Android EAS builds also require the real Firebase config file at:

```text
android/app/google-services.json
```

- Do not use `google-services.json.example` for builds.

## Seed content included
- Hive connectivity
- Live session tracking
- Insights and recommendations
- History and summary
- Account and settings
- Assistant scope

## Runtime behavior
- The function rejects empty messages and very long messages.
- The function verifies the Firebase user token before processing.
- The model request has a timeout so the app does not hang forever on provider delays.
- If the model cannot produce useful text, the backend returns a safer support-oriented fallback reply.
- Assistant replies store their knowledge source labels so the app can render them when history is reopened.
