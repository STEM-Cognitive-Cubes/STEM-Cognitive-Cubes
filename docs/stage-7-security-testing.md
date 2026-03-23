# Stage 7 Security Testing

## Purpose

Stage 7 focuses on **security testing** for Firestore access rules.

This stage is different from backend correctness testing.  
The goal is not only to check whether reads and writes work, but to confirm:

- the correct user is allowed
- the wrong user is denied
- unauthenticated users are blocked
- protected collections are not accidentally public
- unsafe writes are rejected

## Tools used

This project uses:

- Firestore Security Rules
- Firebase Local Emulator Suite
- `@firebase/rules-unit-testing`
- Jest

## Protected Firestore areas in this project

The current app and backend use these important Firestore paths:

- `users/{uid}`
- `users/{uid}/supportTickets`
- `users/{uid}/supportChatMessages`
- `parents/{uid}`
- `parents/{uid}/children`
- `parents/{uid}/sessionMeta`
- `playSessions/{sessionId}`
