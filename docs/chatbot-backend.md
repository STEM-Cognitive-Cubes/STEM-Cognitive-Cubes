# Chatbot Backend

## Architecture
- React Native app sends chatbot messages to a Firebase HTTPS function.
- React Native app can also fetch the latest stored chatbot history from Firebase.
- The app includes the signed-in user's Firebase ID token in the `Authorization` header.
- The Firebase function verifies the user, loads product knowledge from Firestore, calls the model API, and stores messages back in Firestore.
- OpenAI API keys stay on the server side only.

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
2. Set the OpenAI secret in Firebase:
   `firebase functions:secrets:set OPENAI_API_KEY`
3. Optional model override:
   `firebase functions:secrets:set OPENAI_MODEL`
4. Seed the base product knowledge:
   `npm run functions:seed-knowledge`
5. Run the functions emulator:
   `firebase emulators:start --only functions`
6. Set `API_BASE_URL` for Expo.

For local emulation, `API_BASE_URL` should point to:

```env
API_BASE_URL=http://localhost:5001/blokc-13a99/us-central1
```

For a physical Android device, `localhost` will not work. Use your machine IP instead.

## Deployment
- Deploy the chatbot function:
  `firebase deploy --only functions:chatbot`
- Then set `API_BASE_URL` in your app environment to the deployed function base URL.

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
