# Testing Handoff

This repo already has the Stage 1 testing foundation completed on branch `test-foundation-stage-1`.

## 1. Pull the correct branch

```powershell
git fetch origin
git switch test-foundation-stage-1
git pull
```

If you are starting your own work branch for unit tests:

```powershell
git switch -c stage-3-unit-tests
```

## 2. Install dependencies

From the repo root:

```powershell
npm install
```

If Cloud Functions dependencies are needed later:

```powershell
npm run functions:install
```

## 3. Verify the testing foundation

Run these commands from the repo root:

```powershell
npm run lint
npm run type-check
npm test
npm run test:rules
```

If you want to start the local emulator UI manually:

```powershell
npm run emulators:start
```

## 4. What Stage 1 already gives you

- Jest is configured with `jest-expo`
- React Native Testing Library is installed
- Firebase Emulator Suite is configured
- Firestore Security Rules test harness is working
- Maestro folder exists for later E2E flows

Important files:

- [package.json](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/package.json)
- [jest.config.js](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/jest.config.js)
- [jest.rules.config.js](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/jest.rules.config.js)
- [tests/jest/setup.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/tests/jest/setup.ts)
- [tests/smoke/foundation.test.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/tests/smoke/foundation.test.ts)
- [tests/firestore/firestore.rules.test.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/tests/firestore/firestore.rules.test.ts)
- [docs/testing.md](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/docs/testing.md)

## 5. Your assigned work

Your main responsibility is `Stage 3 - Unit Tests`.

Do not change repo-wide config unless necessary. Avoid editing navigation, splash, summary, and settings screens unless discussed first.

Preferred ownership:

- add new tests under `tests/unit`
- test pure logic only
- keep source changes minimal and limited to testability

Good target areas:

- [src/features/auth/utils/firebaseAuthErrors.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/src/features/auth/utils/firebaseAuthErrors.ts)
- [src/features/history/config/groupSessions.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/src/features/history/config/groupSessions.ts)
- [src/services/chatbot.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/src/services/chatbot.ts)
- [src/hooks/useAuth.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/src/hooks/useAuth.ts)

Suggested folder layout:

```text
tests/
  unit/
    auth/
    history/
    services/
```

## 6. First tests to write

Start with these before touching UI tests:

1. Auth error mapping returns the correct message for known Firebase auth codes.
2. Unknown auth errors fall back safely.
3. Session grouping logic returns correctly grouped sections.
4. Empty session input returns an empty result safely.
5. Chatbot request/payload helper builds the expected shape.
6. Any pure formatter/helper function returns stable output for normal and edge inputs.

## 7. Rules to avoid collisions

- Do not edit `.eslintrc.js`, `package.json`, `firebase.json`, Jest config files, or emulator scripts.
- Do not edit the Stage 2 cleanup files owned by the other branch.
- Keep your work inside `tests/unit` whenever possible.
- If a source file must be changed for testability, keep the change small and mention it in your commit message.

## 8. Commit style

Use small commits, not one large commit.

Example:

```powershell
git add tests/unit/auth
git commit -m "Add auth utility unit tests"

git add tests/unit/history
git commit -m "Add session grouping unit tests"
```

## 9. If something fails

- If `npm test` fails, check [jest.config.js](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/jest.config.js) and [tests/jest/setup.ts](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/tests/jest/setup.ts).
- If `npm run test:rules` fails, check Java with `java -version` and re-run.
- If emulator startup fails, check [firebase.json](/c:/Users/Sanuthmee/STEM-Cognitive-Cubes/firebase.json).

## 10. Done condition for your part

Your part is in good shape when:

- new unit tests are added under `tests/unit`
- `npm test` still passes
- your tests are focused on pure logic, not UI styling
- your branch does not include unrelated config changes
