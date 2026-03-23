# Stage 5 Integration Testing

## Scope Used For This Stage

This Stage 5 pass focuses on real frontend-to-backend flows that already exist in the current BlokC codebase.

Automated integration coverage added in this branch:

1. Auth flow characterization against real Firebase Auth + Firestore rules
2. Support email submission with Firestore persistence
3. Support live chat seeding and message persistence
4. Edit profile save flow using the real account service and `users/{uid}`
5. Notification settings persistence and remount behavior characterization

The suite intentionally excludes flows that are currently static, mock-driven, or blocked by missing backend wiring:

1. History list / session history screens use local data
2. Live session save flow is not implemented as a real backend flow in the current screen
3. Summary and session detail screens depend on mock auth / local API endpoints
4. Chatbot flow exists but was left as manual-only for Stage 5 automation because it depends on the Cloud Function path and Gemini-backed runtime availability
5. Parent/child flows under `parents/{uid}` are affected by the current Firestore rules mismatch

## Real Integration Points Confirmed In Repo

Relevant source files:

1. Auth screens:
   - `src/features/auth/screens/LoginScreen.tsx`
   - `src/features/auth/screens/SignupScreen.tsx`
2. Account/profile:
   - `src/features/settings/account/accountService.ts`
   - `src/features/settings/account/editProfileScreen.tsx`
3. Settings persistence:
   - `src/features/settings/settingsService.ts`
   - `src/features/settings/notificationScreen.tsx`
4. Support:
   - `src/features/settings/helpAndSupport/helpSupportService.ts`
   - `src/features/settings/helpAndSupport/emailSupport.tsx`
   - `src/features/settings/helpAndSupport/liveChat.tsx`
5. Firebase project setup:
   - `src/services/firebase.ts`
   - `firebase.json`
   - `firestore.rules`

Important architecture finding confirmed during Stage 5:

1. Firestore rules only allow `users/{userId}` and descendants.
2. Several app flows still read/write `parents/{uid}` and `parents/{uid}/children`.
3. Because of that, auth-related parent profile creation and parent/child profile flows currently conflict with the repo rules and were turned into characterization tests instead of false-green pass tests.

## Automated Stage 5 Test Files Added

1. `tests/integration/auth/auth.integration.test.tsx`
2. `tests/integration/support/support-email.integration.test.tsx`
3. `tests/integration/support/support-chat.integration.test.tsx`
4. `tests/integration/profile/edit-profile.integration.test.tsx`
5. `tests/integration/settings/notification-settings.integration.test.tsx`

Shared Stage 5 helpers/setup added:

1. `tests/integration/helpers/firebaseEmulator.ts`
2. `tests/jest/setup.ts`
3. `src/services/firebase.ts`
4. `jest.config.js`
5. `scripts/run-integration-tests.js`

## Selected Automated Stage 5 Tests

| Test ID | Flow | Test File | Backend/Data Source | Current Outcome | Purpose |
|---|---|---|---|---|---|
| IT-AUTH-01 | Email signup flow | `tests/integration/auth/auth.integration.test.tsx` | Firebase Auth + Firestore | Pass | Verifies real signup path currently creates `users/{uid}` but fails at `parents/{uid}` write under repo rules |
| IT-AUTH-02 | Email login flow | `tests/integration/auth/auth.integration.test.tsx` | Firebase Auth + Firestore | Pass | Verifies valid login still fails in current flow because screen depends on `parents/{uid}` read access |
| IT-SUP-01 | Email support submission | `tests/integration/support/support-email.integration.test.tsx` | Firestore `users/{uid}/supportTickets` | Pass | Confirms UI action saves a support ticket and success feedback is produced |
| IT-SUP-02 | Live support chat | `tests/integration/support/support-chat.integration.test.tsx` | Firestore `users/{uid}/supportChatMessages` | Pass | Confirms first support message is seeded and user + support reply messages persist |
| IT-PROF-01 | Edit profile save | `tests/integration/profile/edit-profile.integration.test.tsx` | Firestore `users/{uid}` | Pass | Confirms profile changes made in UI are persisted by `saveAccountProfile()` |
| IT-SET-01 | Notification preference remount behavior | `tests/integration/settings/notification-settings.integration.test.tsx` | Firestore `users/{uid}.settings.notifications` | Pass | Characterizes current bug where saved notification settings are reset to defaults on remount |

## Test Plan Table

| Test ID | Objective | Preconditions / Seed Data | Steps | Expected Result | Actual Result | Status | Evidence |
|---|---|---|---|---|---|---|---|
| IT-AUTH-01 | Verify real signup behavior with current rules | Firebase emulators running; no existing account for test email | Fill signup form and press `Sign up` | UI shows signup error caused by denied parent write; `users/{uid}` exists; `parents/{uid}` missing | Automated test matched this exact behavior | Pass | Jest output + Firestore emulator inspection |
| IT-AUTH-02 | Verify login behavior with current rules mismatch | Existing auth user in emulator | Login with valid credentials | UI shows login failure because screen tries to access `parents/{uid}`; navigation does not continue | Automated test matched this exact behavior | Pass | Jest output |
| IT-SUP-01 | Verify email support saves ticket | Signed-in auth user | Open Email Support, enter subject/message, press `Send` | Success alert shown; one ticket created in `users/{uid}/supportTickets` | Automated test confirmed alert + saved document | Pass | Jest output + Firestore document |
| IT-SUP-02 | Verify live chat saves conversation flow | Signed-in auth user, empty chat collection | Open Live Chat, observe seeded support message, send one message | Seeded greeting appears; user message saved; support reply saved | Automated test confirmed 3 stored messages total | Pass | Jest output + Firestore chat messages |
| IT-PROF-01 | Verify profile edits persist | Signed-in auth user | Open Edit Profile, update fields, press `Save Changes` | Success alert shown; `users/{uid}` updated | Automated test confirmed updated `fullName`, `phone`, `dateOfBirth` | Pass | Jest output + Firestore document |
| IT-SET-01 | Verify notification settings remount behavior | Signed-in auth user with initial notification settings | Toggle `Battery Alerts` off, verify save, unmount/remount screen | Saved value initially writes as `false`, but remount resets it to default `true` | Automated test confirmed this reset bug | Pass | Jest output + Firestore before/after remount |

## Commands

Primary command:

```bash
npm run test:integration
```

Direct suite command when emulators are already running:

```bash
npm run test:integration:run
```

Notes:

1. `scripts/run-integration-tests.js` starts the Auth and Firestore emulators automatically.
2. The runner attempts to use JDK 21 from `C:\Program Files\Eclipse Adoptium\jdk-21*` on Windows if `JAVA_HOME` is not already set.
3. The integration suite currently runs with `--forceExit` because Firebase listeners keep Jest handles alive after assertions complete.

## Expected Terminal Evidence Pattern

Successful Stage 5 run currently ends with:

```text
Test Suites: 5 passed, 5 total
Tests:       6 passed, 6 total
Snapshots:   0 total
```

The suite currently includes both pass-path tests and characterization tests.
Characterization tests are still reported as passing because the assertions intentionally capture the real broken behavior now present in the app.

## Evidence To Capture For Report / Demo

Recommended evidence set:

1. Terminal screenshot of `npm run test:integration`
2. Screenshot of `tests/integration/auth/auth.integration.test.tsx`
3. Screenshot of `tests/integration/support/support-email.integration.test.tsx`
4. Screenshot of `tests/integration/support/support-chat.integration.test.tsx`
5. Screenshot of `tests/integration/profile/edit-profile.integration.test.tsx`
6. Screenshot of `tests/integration/settings/notification-settings.integration.test.tsx`
7. Firestore emulator UI screenshot of:
   - `users/{uid}/supportTickets`
   - `users/{uid}/supportChatMessages`
   - `users/{uid}` profile fields
8. Firestore emulator log evidence showing permission-denied events for `parents/{uid}`

## Manual / Partial / Blocked Flows

These were intentionally not automated in this pass:

1. Chatbot end-to-end Cloud Function + Gemini response
   - Reason: depends on function runtime and backend availability beyond Auth/Firestore emulator-only scope
   - Recommendation: run manually and capture request/response UI plus function logs

2. Child profile creation and parent profile reads
   - Reason: current repo rules block `parents/**`
   - Recommendation: keep as manual characterization or fix rules/schema first

3. Dashboard/history/session/report flows
   - Reason: current screens are static or local/mock-based rather than real persisted integration surfaces

