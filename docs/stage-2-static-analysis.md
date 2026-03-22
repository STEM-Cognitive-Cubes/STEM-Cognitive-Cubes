# Stage 2 Static Analysis

## What Stage 2 is

Stage 2 focuses on **static analysis testing**. This means checking the code without running the full app behavior in the UI.

In this project, Stage 2 uses:

- TypeScript
- ESLint

These tools help detect problems early before runtime testing, UI testing, or integration testing.

## Why we do this stage

Static analysis is the fastest testing layer. It helps catch:

- unused imports and variables
- missing React Hook dependencies
- weak or inconsistent typing
- bad imports
- risky code patterns
- navigation/type mismatches

Fixing these issues first makes later stages easier:

- Stage 3 unit tests become easier to write
- Stage 4 UI tests become more stable
- Stage 5 integration tests are less likely to fail because of basic code quality issues

## What we completed

During Stage 2, the main goal was to remove **blocking ESLint errors** and confirm that TypeScript still passes.

Completed results:

- ESLint app scan reduced to `0 errors`
- TypeScript check passes with `tsc --noEmit`
- several unused imports and variables were removed
- one React `useEffect` dependency issue was fixed
- dead code was cleaned up without changing UI behavior

## What kind of issues were fixed

Examples of fixes completed in this stage:

- removed unused imports from screens/components
- removed unused variables and parameters
- removed dead code that was no longer part of runtime behavior
- fixed missing dependency values in a `useEffect`

## What we did not focus on yet

Some warnings still remain, mainly:

- inline style warnings
- nested component warnings
- lower-priority code quality warnings

These were not treated as blockers because the priority was to clear actual errors first and keep momentum for later testing stages.

## Why this helps the project

Stage 2 improves the codebase before deeper testing begins. It reduces noise, prevents simple mistakes from spreading, and creates a safer base for:

- unit tests
- component tests
- integration tests
- backend and emulator-based tests

## Verification commands

Commands used for this stage:

```powershell
npx eslint App.tsx src\\**\\*.ts src\\**\\*.tsx
npm run type-check
```

## Summary

Stage 2 was used as the first full code-quality pass across the app. The purpose was to catch structural problems early, remove blocking static-analysis errors, and prepare the repo for the next layers of testing.
