# Stage 6 Backend Testing Results

## Scope

Stage 6 focused only on backend and backend-like logic in the current BlokC repository.

This stage covered:

1. Firestore-backed service behavior
2. Backend validation and invalid-input rejection
3. Duplicate-handling behavior where implemented
4. Cloud Function response behavior
5. Backend error handling and response structure

This stage did not focus on:

1. frontend rendering
2. UI component verification
3. full Stage 5 user-flow integration coverage
4. Firestore security rules as the main target

## Backend Surface Actually Tested

The following real backend/backend-facing modules were tested:

1. `src/features/settings/account/accountService.ts`
2. `src/features/settings/settingsService.ts`
3. `src/features/settings/helpAndSupport/helpSupportService.ts`
4. `functions/index.js`

Firebase/backend setup used for Stage 6:

1. `firebase.json`
2. `scripts/run-backend-tests.js`
3. `tests/backend/helpers/backendEmulator.ts`
4. `src/services/firebase.ts`

Cloud Functions covered:

1. `chatbotHistory`
2. `chatbot`
3. `finalizeSession`

## Backend Test Execution Environment

Stage 6 used the Firebase Local Emulator Suite.

Services used in the backend run:

1. Authentication Emulator
2. Firestore Emulator
3. Functions Emulator
4. Storage Emulator

Primary command:

```bash
npm run test:backend
```

Backend-only Jest command used by the runner:

```bash
jest tests/backend --runInBand --forceExit --testTimeout=20000
```

## Test Files Added for Stage 6

### Service-level backend suites

1. `tests/backend/services/account-service.backend.test.ts`
2. `tests/backend/services/settings-service.backend.test.ts`
3. `tests/backend/services/support-service.backend.test.ts`

### Cloud Function backend suites

1. `tests/backend/functions/chatbot-history.function.test.ts`
2. `tests/backend/functions/chatbot.function.test.ts`
3. `tests/backend/functions/finalize-session.function.test.ts`

## Final Stage 6 Result

Latest successful backend run:

```text
Test Suites: 6 passed, 6 total
Tests:       23 passed, 23 total
Snapshots:   0 total
```

Interpretation:

1. Six backend-focused test files ran successfully
2. Twenty-three backend test cases passed
3. No snapshot tests were used
4. The full backend emulator stack was able to support the executed Stage 6 suite

## Executed Backend Test Areas

### 1. Account service backend coverage

File:

1. `tests/backend/services/account-service.backend.test.ts`

What was validated:

1. new user profile document creation through `ensureAccountProfile`
2. backend update of persisted profile fields through `saveAccountProfile`
3. rejection of invalid profile payloads with missing required fields
4. deletion of the Firestore user document and auth account through `deleteCurrentAccount`

Backend behaviors confirmed:

1. `users/{uid}` is created with expected fields
2. profile updates persist correctly to Firestore
3. empty full name and empty email are rejected
4. delete flow removes the Firestore doc and auth account

### 2. Settings service backend coverage

File:

1. `tests/backend/services/settings-service.backend.test.ts`

What was validated:

1. default notification settings document shape
2. backend merge behavior for partial notification updates
3. authenticated-user requirement for settings writes

Backend behaviors confirmed:

1. notification settings defaults are written to Firestore
2. partial notification updates preserve remaining fields
3. unauthenticated settings writes are rejected

### 3. Support backend coverage

File:

1. `tests/backend/services/support-service.backend.test.ts`

What was validated:

1. support ticket Firestore creation
2. support ticket authenticated-user requirement
3. support chat empty-message rejection
4. support chat backend creation of both user and support reply messages

Backend behaviors confirmed:

1. support tickets are written under `users/{uid}/supportTickets`
2. support chat writes occur under `users/{uid}/supportChatMessages`
3. blank chat payloads are rejected
4. valid support chat calls create the expected backend message pair

### 4. chatbotHistory Cloud Function coverage

File:

1. `tests/backend/functions/chatbot-history.function.test.ts`

What was validated:

1. missing bearer token rejection
2. invalid HTTP method rejection
3. empty conversation response shape
4. structured history response for stored conversation data

Backend behaviors confirmed:

1. unauthenticated requests return `401`
2. invalid methods return `405`
3. no-conversation response returns a valid empty payload shape
4. stored message history is returned with expected keys

### 5. chatbot Cloud Function validation coverage

File:

1. `tests/backend/functions/chatbot.function.test.ts`

What was validated:

1. missing bearer token rejection
2. invalid HTTP method rejection
3. missing `message` payload rejection
4. too-long `message` payload rejection

Backend behaviors confirmed:

1. unauthenticated requests return `401`
2. invalid methods return `405`
3. missing message returns `400`
4. oversized message returns `400`

### 6. finalizeSession Cloud Function coverage

File:

1. `tests/backend/functions/finalize-session.function.test.ts`

What was validated:

1. missing bearer token rejection
2. missing `sessionId` rejection
3. forbidden finalize attempt on another parent's session
4. successful finalize path with valid payload
5. duplicate-handling path when edge events already exist in Firestore

Backend behaviors confirmed:

1. unauthenticated requests return `401`
2. invalid payloads without `sessionId` return `400`
3. mismatched ownership returns `403`
4. valid finalize requests return expected response shape and persist playback/session metadata
5. repeated finalization uses stored edge events rather than duplicating them

## Main Successful Backend Areas

The strongest backend areas currently evidenced by Stage 6 are:

1. account document create/update/delete behavior
2. settings persistence document shape and merge behavior
3. support ticket persistence
4. support chat persistence and empty-input rejection
5. `chatbotHistory` response structure
6. `chatbot` invalid-payload rejection
7. `finalizeSession` success, ownership checks, and duplicate-event handling

## Backend Issues / Limitations Identified

Stage 6 did not hide backend limitations. The following limitations remain relevant:

1. `chatbot` success-path generation still depends on external model behavior and secrets beyond local invalid-input testing
2. some backend flows in the wider app still depend on parent/session UI layers and are better handled in Stage 5 or later stages
3. emulator output still shows warnings about outdated `firebase-functions` and Node version mismatch in local host tooling
4. the backend suite requires `--forceExit` because Firebase emulator/test handles stay open after assertions complete

These did not block the executed backend assertions, but they are valid technical observations for the report.

## Existing Evidence That Supports Stage 6

Automated evidence produced by this stage:

1. terminal output showing `6 passed` suites and `23 passed` tests
2. emulator logs showing functions startup and request handling
3. Firestore emulator state for:
   - `users/{uid}`
   - `users/{uid}/supportTickets`
   - `users/{uid}/supportChatMessages`
   - `playSessions/{sessionId}`
   - `parents/{uid}/sessionMeta/latestEndedSession`
4. function response payloads asserted in the backend tests

Supporting but secondary evidence:

1. existing integration tests from Stage 5 also confirm some backend persistence paths
2. existing Firestore rules tests confirm collection access rules, but those belong primarily to Stage 7 rather than Stage 6

## Not Currently Testable or Not Fully Covered in Stage 6

The following backend areas were identified but not fully covered as strong automated Stage 6 targets:

1. full `chatbot` successful model-response generation through external AI provider
2. higher-level dashboard/history/summary analytics paths that are not implemented as clean backend modules
3. backend behavior for flows that remain mostly static or frontend-driven rather than service/function-driven

These should be marked honestly as either partial or not currently testable in the final report.

## Conclusion

Stage 6 backend testing successfully validated the current repository’s real backend logic across Firestore-backed services and Cloud Functions. The final backend suite passed with six suites and twenty-three tests, confirming correct CRUD behavior, backend validation, response structure, authenticated access checks, and implemented duplicate-handling paths. The stage also documented current limits, especially around full chatbot generation success paths and emulator/tooling warnings, without hiding these constraints.
