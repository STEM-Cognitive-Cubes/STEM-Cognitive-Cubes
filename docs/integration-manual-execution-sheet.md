# Stage 5 Manual Execution Sheet

Use this sheet while running the app manually. Fill `Actual Result` and mark the status during testing.

## M-01 Signup Creates Parent Profile Flow

- Test name: `M-01 Signup creates account and parent profile`
- Exact steps to perform:
  1. Launch the app and open `Signup`.
  2. Enter first name, last name, email, password, and confirm password.
  3. Press `Sign up`.
  4. Check the screen result.
  5. Check Firebase Auth emulator/project for the new user.
  6. Check Firestore for `users/{uid}` and `parents/{uid}`.
- Expected result:
  - With current repo rules, signup currently fails at `parents/{uid}` write.
  - `users/{uid}` may still exist.
  - Error text should appear on screen.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Signup screen after pressing `Sign up`
  - Firebase Auth user record
  - Firestore `users/{uid}` doc
  - Missing/blocked `parents/{uid}` evidence

## M-02 Login With Valid Credentials

- Test name: `M-02 Login with valid credentials`
- Exact steps to perform:
  1. Use a valid email/password account already in Firebase/Auth emulator.
  2. Open `Login`.
  3. Enter the credentials.
  4. Press `Login`.
- Expected result:
  - With current repo rules, login currently shows an error because the screen still depends on `parents/{uid}`.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Login screen with entered credentials
  - Error message screenshot
  - Optional Firestore/rules log showing denied parent access

## M-03 Edit Profile Save

- Test name: `M-03 Edit profile saves to users collection`
- Exact steps to perform:
  1. Log into the app.
  2. Open `Settings -> Account -> Edit Profile`.
  3. Change full name, phone number, and date of birth.
  4. Press `Save Changes`.
  5. Re-open the Firestore user document.
- Expected result:
  - Success alert appears.
  - `users/{uid}` updates with new profile values.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Edit Profile screen before save
  - Success alert screenshot
  - Firestore `users/{uid}` updated fields

## M-04 Email Support Request

- Test name: `M-04 Email support saves ticket`
- Exact steps to perform:
  1. Log into the app.
  2. Go to `Settings -> Help & Support -> Email Support`.
  3. Enter a subject and message.
  4. Press `Send`.
  5. Open `Contact Support` or Firestore.
- Expected result:
  - Success alert appears.
  - New ticket appears under `users/{uid}/supportTickets`.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Email Support form screenshot before send
  - Success alert screenshot
  - Firestore support ticket document
  - Contact Support screen showing updated request count if visible

## M-05 Live Support Chat

- Test name: `M-05 Live chat persists messages`
- Exact steps to perform:
  1. Log into the app.
  2. Open `Settings -> Help & Support -> Live Chat`.
  3. Confirm the seeded support greeting appears.
  4. Type a message and send it.
  5. Wait for the automatic support reply.
  6. Check Firestore chat collection.
- Expected result:
  - Seeded greeting appears.
  - User message appears.
  - Auto support reply appears.
  - Firestore stores the conversation entries.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Live Chat screen before sending
  - Live Chat screen after reply
  - Firestore `users/{uid}/supportChatMessages`

## M-06 Notification Preference Save / Remount

- Test name: `M-06 Notification preference remount behavior`
- Exact steps to perform:
  1. Log into the app.
  2. Open `Settings -> Notification Preferences`.
  3. Turn `Battery Alerts` off.
  4. Wait for save confirmation.
  5. Leave the screen completely.
  6. Open `Notification Preferences` again.
- Expected result:
  - Current code saves the value first.
  - On remount, the screen currently resets it back to the default value.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Notification screen after turning the option off
  - Firestore `users/{uid}.settings.notifications`
  - Notification screen after reopening

## M-07 Chatbot Request / Response

- Test name: `M-07 Chatbot request reaches backend`
- Exact steps to perform:
  1. Ensure the chatbot backend/function is deployed or the function endpoint is reachable.
  2. Log into the app.
  3. Open the Bot/Assistant screen.
  4. Send a message.
  5. Wait for a reply or failure state.
- Expected result:
  - If backend is reachable, reply renders in UI and conversation history persists.
  - If backend is unavailable, a readable failure message appears.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Bot screen before send
  - Bot screen after reply/error
  - Cloud Function log or backend log
  - Firestore conversation records if saved

## M-08 Add Child Profile

- Test name: `M-08 Add child profile`
- Exact steps to perform:
  1. Log into the app.
  2. Open Profile.
  3. Tap `Add Child`.
  4. Enter child name and birthday.
  5. Save.
- Expected result:
  - With current repo rules, this flow may fail because it writes under `parents/{uid}/children`.
- Actual result:
  - ______________________________
- Pass/Fail:
  - [ ] Pass
  - [ ] Fail
- Evidence to capture:
  - Add Child screen before save
  - Result message or screen state after save
  - Firestore `parents/{uid}/children` evidence or permission failure evidence

