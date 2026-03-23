# Stage 4 UI / Component Testing

## What Stage 4 means

Stage 4 focuses on **component and UI testing**.  
The purpose of this stage is to test screens from the **user's perspective** rather than testing internal implementation details.

This means the tests check:

- what text appears on the screen
- whether important inputs and buttons render
- whether typing into inputs works
- whether pressing buttons triggers the expected UI behavior
- whether navigation actions are triggered
- whether loading, empty, and basic interaction states appear correctly

This stage does **not** focus on:

- internal state variables
- exact styling details such as colors or spacing
- backend correctness
- full end-to-end application flow

## Tools used

The UI tests in this project use:

- Jest
- `jest-expo`
- React Native Testing Library

These tools are commonly used for React Native UI testing and allow screens to be tested in isolation with mocked dependencies.

## Why this stage is important

UI testing helps prove that the app behaves correctly for the user.

It helps verify:

- screens render without breaking
- user input is accepted correctly
- buttons respond properly
- important UI states are visible
- screen-level interactions work before backend integration is fully relied on

This makes it easier to catch interface problems early before moving deeper into integration and end-to-end testing.

## What was covered in this project

Stage 4 currently covers these screens:

- Login screen
- Signup screen
- Splash screen
- Summary screen
- Home screen
- Profile screen
- Chatbot screen

## What each test group checks

### 1. Login screen

The login screen tests verify:

- the main screen content renders correctly
- email and password inputs update when the user types
- forgot password modal opens when pressed
- signup navigation is triggered from the footer link

### 2. Signup screen

The signup screen tests verify:

- the main signup screen content renders
- all signup form inputs accept user input
- validation error appears when required fields are missing
- logout button navigates back to login

### 3. Splash screen

The splash screen tests verify:

- the splash animation component renders
- the completion callback runs when the animation finishes

### 4. Summary screen

The summary screen tests verify:

- loading state appears while data is being fetched
- empty state appears when no weekly data is returned
- summary cards render when weekly data is available

### 5. Home screen

The home screen tests verify:

- the main home content renders
- the "Track Now" button navigates to the session flow
- the "History" quick action triggers navigation

### 6. Profile screen

The profile screen tests verify:

- profile screen sections render correctly
- the "Add Another Child" action triggers navigation

### 7. Chatbot screen

The chatbot screen tests verify:

- chatbot screen content renders correctly
- a message can be entered and sent
- the mocked bot reply appears in the chat

## Why mocks were used

These UI tests use mocked dependencies instead of real backend services.

This was done because Stage 4 is about screen behavior, not backend integration.

Mocking is useful here because it:

- keeps the tests fast
- avoids relying on Firebase or network availability
- lets the UI be tested in isolation
- makes the tests more stable and repeatable

## What this stage proves

This stage proves that the app’s main user-facing screens respond correctly to common user interactions.

It gives confidence that:

- users can see important screens
- forms and inputs behave correctly
- navigation triggers fire
- important UI states such as loading and empty results are displayed
- the chatbot UI can handle basic send/response interaction

## What this stage does not prove

This stage does not confirm:

- real backend correctness
- Firestore write/read correctness
- Firebase authentication correctness
- emulator-backed flows
- end-to-end behavior across the whole app

Those belong to later stages such as:

- integration testing
- backend testing
- security rules testing
- end-to-end testing

## Verification

These UI tests were added under:

```text
tests/ui/
```

Example verification command:

```powershell
npx jest --runInBand tests/ui
```

## Summary

Stage 4 was used to test the visible behavior of major screens in the application.  
The work focused on rendering, interaction, validation, loading states, empty states, and navigation triggers.  
This provides a strong user-facing testing layer before moving into deeper integration and backend-focused stages.
