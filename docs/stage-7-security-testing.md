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

## What was tested

The Stage 7 rules test suite currently verifies:

### User profile access

- signed-in user can read their own `users/{uid}` document
- another authenticated user cannot read someone else’s `users/{uid}` document
- unauthenticated writes to protected user data are denied

### Parent profile subtree access

- signed-in parent can manage their own `parents/{uid}` document
- signed-in parent can access their own child/session subtree under `parents/{uid}`
- another authenticated user cannot access another parent’s subtree

### Support collections under `users/{uid}`

- signed-in user can manage their own `supportTickets`
- signed-in user can manage their own `supportChatMessages`
- another authenticated user cannot access another user’s support collections
- unauthenticated access to support collections is denied

### Play session security

- signed-in user can create a play session only for their own `parentId`
- signed-in user can read their own play session
- another authenticated user cannot read another parent’s play session
- owner can update a play session only if ownership remains the same
- owner cannot rewrite `parentId` to another user
- malformed play session creation without required fields is denied
