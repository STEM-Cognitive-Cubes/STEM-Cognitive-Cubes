# Stage 5 Integration Testing Results

## Purpose

This document records the final Stage 5 integration-testing scope and outcomes for the current BlokC mobile application implementation.

Stage 5 was used to verify real frontend-to-backend flows rather than isolated unit logic. The focus was on executed user flows where React Native screens, Firebase initialization, Firebase Authentication, Cloud Firestore, and the app service layer interacted together.

## Environment Used

Stage 5 was executed against the Firebase Emulator Suite rather than production Firebase.

Services used in the automated run:

1. Firebase Authentication Emulator
2. Cloud Firestore Emulator

Relevant project files:

1. `firebase.json`
2. `scripts/run-integration-tests.js`
3. `scripts/firebase-cli.js`
4. `tests/integration/helpers/firebaseEmulator.ts`
5. `src/services/firebase.ts`
6. `jest.config.js`
7. `tests/jest/setup.ts`

Primary execution command:

```bash
npm run test:integration
```

This command:

1. Starts the local Firebase Auth and Firestore emulators
2. Runs the integration suites under `tests/integration`
3. Stops the emulators after the test run completes

## Automated Integration Scope Completed

The following integration areas were executed and evidenced in Stage 5:

1. Authentication flow characterization under current Firestore rules
2. Support email submission with Firestore persistence
3. Live support chat persistence with seeded and generated messages
4. Edit profile save flow with Firestore update verification
5. Notification preference persistence and remount behavior characterization

Automated integration test files:

1. `tests/integration/auth/auth.integration.test.tsx`
2. `tests/integration/support/support-email.integration.test.tsx`
3. `tests/integration/support/support-chat.integration.test.tsx`
4. `tests/integration/profile/edit-profile.integration.test.tsx`
5. `tests/integration/settings/notification-settings.integration.test.tsx`

## Final Automated Result

Latest Stage 5 execution result:

```text
Test Suites: 5 passed, 5 total
Tests:       6 passed, 6 total
Snapshots:   0 total
```

Interpretation:

1. Five integration test files ran successfully
2. Six integration test cases ran successfully
3. No snapshot-based tests were used
4. The emulator-backed integration suite completed successfully

## Executed Integration Flows and Outcomes

### 1. Signup flow under current backend rules

Frontend modules:

1. `src/features/auth/screens/SignupScreen.tsx`

Backend interaction:

1. Firebase Auth user creation
2. Firestore `users/{uid}` write
3. Attempted Firestore `parents/{uid}` write

Observed outcome:

1. Signup creates the authenticated user
2. `users/{uid}` is created
3. `parents/{uid}` write is blocked by current rules
4. The screen shows the signup failure state

Status:

1. Pass as a characterization test

Meaning:

This is a valid Stage 5 result because it records the current real integration behavior between the frontend signup flow and the backend rules configuration.

### 2. Login flow under current parent-profile dependency

Frontend modules:

1. `src/features/auth/screens/LoginScreen.tsx`

Backend interaction:

1. Firebase Auth sign-in
2. Firestore read dependency on `parents/{uid}`

Observed outcome:

1. Valid authentication succeeds
2. The overall login flow still fails because the screen depends on parent-profile access
3. Navigation does not proceed

Status:

1. Pass as a characterization test

Meaning:

This exposed a real integration mismatch between implemented frontend flow expectations and repository Firestore rules.

### 3. Email support request submission

Frontend modules:

1. `src/features/settings/helpAndSupport/emailSupport.tsx`
2. `src/features/settings/helpAndSupport/helpSupportService.ts`

Backend interaction:

1. Firestore write to `users/{uid}/supportTickets`

Observed outcome:

1. User enters a support subject and message
2. Success alert is shown
3. Support ticket document is created in Firestore with expected values

Status:

1. Pass

Meaning:

This is a fully working integration path between the support UI and Firestore persistence.

### 4. Live support chat

Frontend modules:

1. `src/features/settings/helpAndSupport/liveChat.tsx`
2. `src/features/settings/helpAndSupport/helpSupportService.ts`

Backend interaction:

1. Firestore read/write to `users/{uid}/supportChatMessages`

Observed outcome:

1. Initial support greeting is seeded
2. User message is stored
3. Automatic support reply is stored
4. Three total chat messages exist in Firestore for the tested flow

Status:

1. Pass

Meaning:

This verified a multi-step frontend/backend integration path rather than a single isolated write.

### 5. Edit profile save

Frontend modules:

1. `src/features/settings/account/editProfileScreen.tsx`
2. `src/features/settings/account/accountService.ts`

Backend interaction:

1. Firestore write to `users/{uid}`

Observed outcome:

1. User edits full name, phone number, and date of birth
2. Success alert is shown
3. Updated values are persisted in the Firestore user document

Status:

1. Pass

Meaning:

This confirms that the implemented profile edit path is integrated correctly with the current `users/{uid}` account model.

### 6. Notification preference remount behavior

Frontend modules:

1. `src/features/settings/notificationScreen.tsx`
2. `src/features/settings/settingsService.ts`

Backend interaction:

1. Firestore read/write to `users/{uid}.settings.notifications`

Observed outcome:

1. Notification preference change is initially saved to Firestore
2. Reopening the screen resets the value back to the default state

Status:

1. Pass as a characterization test

Meaning:

The integration path exists, but Stage 5 exposed a real persistence/remount defect in the current implementation.

## Main Successful Integration Areas

The strongest successful backend-connected integrations currently evidenced are:

1. Support ticket submission
2. Support live chat persistence
3. Profile save to `users/{uid}`
4. Notification settings write path

## Main Issues Found During Stage 5

### 1. Firestore rules mismatch with parent-based flows

Current repository rules allow:

1. `users/{userId}`
2. descendants under `users/{userId}`

But several implemented screens still rely on:

1. `parents/{uid}`
2. `parents/{uid}/children`

Effect:

1. Signup parent profile creation is blocked
2. Login parent profile read is blocked
3. Parent/child profile flows are not fully integrated under the current rules

### 2. Account model inconsistency

Observed mismatch:

1. Edit Profile writes to `users/{uid}`
2. Other account/profile flows still depend on `parents/{uid}`

Effect:

1. Profile data is not consistently modeled across all frontend modules

### 3. Notification settings reset bug

Observed behavior:

1. Value writes correctly
2. Screen remount resets the saved setting to defaults

Effect:

1. Backend persistence exists, but the final user-visible behavior is still incorrect

## Integration Areas Identified but Not Fully Evidenced in Stage 5

The following features exist in the codebase but were not supported by equally strong automated Stage 5 evidence in the current run:

1. Chatbot end-to-end request/response flow
2. Parent profile management
3. Child profile creation and update
4. Dashboard/session/history/report synchronization flows

Reason:

1. Some rely on Cloud Functions or external runtime availability beyond the current emulator-backed scope
2. Some rely on parent-based Firestore collections that conflict with current rules
3. Some screens are static, local, or not yet strongly backend-driven

## Evidence Recommended for Report or Appendix

Recommended Stage 5 evidence set:

1. Terminal screenshot of `npm run test:integration`
2. Screenshot of final pass summary:
   - `Test Suites: 5 passed, 5 total`
   - `Tests: 6 passed, 6 total`
3. Screenshot of:
   - `tests/integration/auth/auth.integration.test.tsx`
   - `tests/integration/support/support-email.integration.test.tsx`
   - `tests/integration/support/support-chat.integration.test.tsx`
   - `tests/integration/profile/edit-profile.integration.test.tsx`
   - `tests/integration/settings/notification-settings.integration.test.tsx`
4. Firestore emulator screenshots for:
   - `users/{uid}`
   - `users/{uid}/supportTickets`
   - `users/{uid}/supportChatMessages`
5. Screenshot of notification setting before and after reopening the screen
6. Error-state evidence for signup/login under parent-profile rules mismatch

## Conclusion

Stage 5 integration testing confirmed that several real frontend-to-backend flows in the current BlokC app are functioning correctly, especially support submission, support chat persistence, and profile editing against the `users/{uid}` data model. At the same time, the stage identified important backend integration defects, most notably the mismatch between current Firestore rules and frontend flows that still depend on `parents/{uid}`, as well as the notification setting reset issue on remount.

Therefore, Stage 5 served both as:

1. a validation phase for implemented working integrations, and
2. a defect-discovery phase for incomplete or misaligned frontend/backend connections.
