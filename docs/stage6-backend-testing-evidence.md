# Stage 6 Backend Testing Evidence Guide

## Primary Run Command

Use this command to execute the full Stage 6 backend suite:

```bash
npm run test:backend
```

This starts:

1. Auth emulator
2. Firestore emulator
3. Functions emulator
4. Storage emulator

Then it runs:

```bash
jest tests/backend --runInBand --forceExit --testTimeout=20000
```

## Expected Successful Terminal Pattern

Capture the final lines showing:

```text
PASS tests/backend/services/support-service.backend.test.ts
PASS tests/backend/functions/finalize-session.function.test.ts
PASS tests/backend/functions/chatbot-history.function.test.ts
PASS tests/backend/services/account-service.backend.test.ts
PASS tests/backend/functions/chatbot.function.test.ts
PASS tests/backend/services/settings-service.backend.test.ts

Test Suites: 6 passed, 6 total
Tests:       23 passed, 23 total
Snapshots:   0 total
```

This is the strongest general proof that Stage 6 backend testing ran successfully.

## Best Evidence to Capture Per Backend Area

### 1. Account backend tests

Best files:

1. `tests/backend/services/account-service.backend.test.ts`
2. `src/features/settings/account/accountService.ts`

Best evidence:

1. terminal screenshot of the account backend suite passing
2. Firestore emulator screenshot of `users/{uid}` after create/update
3. evidence that the user document is removed after delete

### 2. Settings backend tests

Best files:

1. `tests/backend/services/settings-service.backend.test.ts`
2. `src/features/settings/settingsService.ts`

Best evidence:

1. terminal screenshot of the settings backend suite passing
2. Firestore emulator screenshot of `users/{uid}.settings.notifications`
3. screenshot or log showing expected default keys exist
4. screenshot or log showing partial notification update result

### 3. Support backend tests

Best files:

1. `tests/backend/services/support-service.backend.test.ts`
2. `src/features/settings/helpAndSupport/helpSupportService.ts`

Best evidence:

1. terminal screenshot of the support backend suite passing
2. Firestore emulator screenshot of `users/{uid}/supportTickets`
3. Firestore emulator screenshot of `users/{uid}/supportChatMessages`
4. assertion screenshot showing empty-message rejection

### 4. chatbotHistory Cloud Function tests

Best files:

1. `tests/backend/functions/chatbot-history.function.test.ts`
2. `functions/index.js`

Best evidence:

1. terminal screenshot of the function suite passing
2. code snippet showing:
   - missing bearer token rejection
   - empty response shape
   - valid structured history response
3. emulator console showing function endpoint initialization

### 5. chatbot Cloud Function validation tests

Best files:

1. `tests/backend/functions/chatbot.function.test.ts`
2. `functions/index.js`

Best evidence:

1. terminal screenshot of the suite passing
2. code snippet showing:
   - missing token rejection
   - missing message rejection
   - oversized message rejection
3. emulator output showing `chatbot` function initialized

### 6. finalizeSession Cloud Function tests

Best files:

1. `tests/backend/functions/finalize-session.function.test.ts`
2. `functions/index.js`

Best evidence:

1. terminal screenshot of the suite passing
2. Firestore emulator screenshot of:
   - `playSessions/{sessionId}`
   - `playSessions/{sessionId}/edgeEvents`
   - `parents/{uid}/sessionMeta/latestEndedSession`
3. code snippet showing:
   - missing `sessionId` rejection
   - forbidden ownership check
   - successful response shape
   - duplicate-edge-event handling

## Emulator Evidence

Useful emulator-based proof:

1. functions emulator startup lines showing:
   - `chatbotHistory`
   - `chatbot`
   - `finalizeSession`
2. Firestore emulator state before and after a test run
3. storage emulator being started for finalize-session backend coverage

## Files to Screenshot for the Report

Recommended Stage 6 screenshot set:

1. `tests/backend/services/account-service.backend.test.ts`
2. `tests/backend/services/settings-service.backend.test.ts`
3. `tests/backend/services/support-service.backend.test.ts`
4. `tests/backend/functions/chatbot-history.function.test.ts`
5. `tests/backend/functions/chatbot.function.test.ts`
6. `tests/backend/functions/finalize-session.function.test.ts`
7. `functions/index.js`
8. `docs/stage6-backend-testing-results.md`

## Evidence Notes for Report Writing

When writing the final report, keep the evidence separated like this:

1. backend CRUD evidence
2. backend validation evidence
3. backend duplicate-handling evidence
4. cloud function response/error evidence

This keeps Stage 6 clearly separated from Stage 5 integration testing and Stage 7 rules/security testing.
