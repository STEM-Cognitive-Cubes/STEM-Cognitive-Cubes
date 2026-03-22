# Testing Setup

Stage 1 foundation commands:

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run emulators:start`
- `npm run test:rules`

Notes:

- `npm test` runs the Jest + `jest-expo` suite and excludes Firestore rules tests.
- `npm run test:rules` boots the Firestore emulator for the rules test run.
- `npm run emulators:start` starts the Auth, Firestore, and Functions emulators with the Firebase UI.
- Maestro flow files live in `.maestro/flows`.
- Firestore emulator startup requires Java on your system `PATH`. Verify with `java -version` before running emulator-backed tests.
- In this repo, `npm run lint`, `npm run type-check`, and `npm test` should pass without needing the emulators.
- For Stage 1, `npm run lint` is intentionally scoped to test and tooling files. Full app-wide static analysis belongs in Stage 2.

Expected Stage 1 result:

- Static checks: `npm run lint`
- Type checks: `npm run type-check`
- Jest app tests: `npm test`
- Full emulator stack: `npm run emulators:start`
- Firestore rules tests: `npm run test:rules`
