# Unit Testing Guide (Stage 3)

This document covers the unit tests added in Stage 3 and how to run/check them.

## Scope

Unit tests currently cover:

- Auth error mapping:
  - `src/features/auth/utils/firebaseAuthErrors.ts`
- History grouping logic:
  - `src/features/history/config/groupSessions.ts`
- Chatbot service pure request/response/error handling:
  - `src/services/chatbot.ts`

Test files:

- `tests/unit/auth/firebaseAuthErrors.test.ts`
- `tests/unit/history/groupSessions.test.ts`
- `tests/unit/services/chatbot.test.ts`

## Commands

Run only Stage 3 unit tests:

- `npm run test:unit`

Verbose output (shows each test case):

- `npm run test:unit -- --verbose`

Coverage output:

- `npm run test:unit -- --coverage`

## Current Result Baseline

Expected baseline from latest run:

- Test Suites: `3 passed, 3 total`
- Tests: `16 passed, 16 total`
- Snapshots: `0 total`

## What “Suite” Means

- A suite is a test file.
- `3 suites` means those 3 files above executed successfully.

## Notes

- These tests are fast and logic-focused (no emulator dependency).
- Full Firebase emulator integration/rules tests are covered separately in Stage 1/other docs.
