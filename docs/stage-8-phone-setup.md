# Stage 8 Phone Setup Guide

## Purpose

This guide explains how to run the Stage 8 Maestro end-to-end flows on a real Android phone.

It is intended for teammates who want to test the same E2E flows from their own machine and phone.

## What Stage 8 uses

Stage 8 in this project uses:

- Maestro
- a real Android phone or Android emulator
- the app running from the local project
- the Maestro flow files inside `.maestro/flows`

## Before you start

Make sure you have:

- pulled the latest `stage-8-e2e-tests` branch
- Node dependencies installed with `npm install`
- the app project opening correctly with Expo
- a USB cable for your Android phone

## 1. Pull the correct branch

Run:

```powershell
git fetch origin
git switch stage-8-e2e-tests
git pull
```

## 2. Install Maestro

If Maestro is not already installed, run this from PowerShell:

```powershell
& "C:\Program Files\Git\bin\bash.exe" -lc 'curl -fsSL "https://get.maestro.mobile.dev" | bash'
```

If that path does not exist, try:

```powershell
& "C:\Program Files\Git\usr\bin\bash.exe" -lc 'curl -fsSL "https://get.maestro.mobile.dev" | bash'
```

Then in the current PowerShell session:

```powershell
$env:PATH += ";$HOME\.maestro\bin"
maestro --version
```

If you want Maestro permanently available in PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$HOME\.maestro\bin", "User")
```

Then reopen PowerShell.

## 3. Prepare the Android phone

On the phone:

1. open `Settings`
2. open `About phone`
3. tap `Build number` 7 times
4. go back and open `Developer options`
5. enable `Developer options`
6. enable `USB debugging`
7. connect the phone with USB
8. accept the `Allow USB debugging` prompt

Keep the phone:

- unlocked
- connected by USB
- awake during the test run

## 4. Start the app

Open one terminal and run:

```powershell
npx expo start --clear
```

Use that terminal only for Expo.

Keep it running while the phone is connected to the app.

## 5. Run Maestro from a second terminal

Open a second terminal in the same repo folder.

In that second terminal, first make sure Maestro is available:

```powershell
$env:PATH += ";$HOME\.maestro\bin"
maestro --version
```

## 6. Set test environment variables

In the Maestro terminal, set:

```powershell
$env:MAESTRO_LOGIN_EMAIL="your-test-email@example.com"
$env:MAESTRO_LOGIN_PASSWORD="your-test-password"
$env:MAESTRO_SIGNUP_FIRST_NAME="Test"
$env:MAESTRO_SIGNUP_LAST_NAME="User"
$env:MAESTRO_SIGNUP_EMAIL="new-test-user@example.com"
$env:MAESTRO_SIGNUP_PASSWORD="TestPassword123!"
$env:MAESTRO_CHILD_NAME="Nehara Fernando"
```

These are used by the Stage 8 flow files.

## 7. Run flows one by one

Recommended order:

```powershell
maestro test .maestro/flows/auth-login.yaml
maestro test .maestro/flows/home-start-session.yaml
maestro test .maestro/flows/profile-add-child.yaml
maestro test .maestro/flows/settings-logout.yaml
maestro test .maestro/flows/auth-signup.yaml
```

After that, run the grouped smoke suite:

```powershell
maestro test .maestro/flows/smoke-suite.yaml
```

## 8. What a passing result looks like

For each flow, Maestro should complete the listed steps and finish without a failure.

If a flow passes, keep:

- the terminal output
- screenshots if needed
- notes on which flows passed

## 9. Common issues

### Maestro not found

Run:

```powershell
$env:PATH += ";$HOME\.maestro\bin"
maestro --version
```

### 0 devices connected

This usually means the phone is not available through Android debugging.

Check:

- USB debugging is enabled
- the phone is unlocked
- the USB permission prompt was accepted
- the cable supports data, not only charging

### Flow fails on the first assertion

This usually means:

- the app launched to a different screen
- the text selector is too strict
- the app resumed old state instead of starting fresh

Check the Maestro debug output folder and compare it to the expected flow steps.

### Expo terminal is busy

That is expected.

Use:

- terminal 1 for `npx expo start --clear`
- terminal 2 for Maestro commands

## 10. Files used in Stage 8

Main flow files:

- `.maestro/flows/auth-login.yaml`
- `.maestro/flows/auth-signup.yaml`
- `.maestro/flows/home-start-session.yaml`
- `.maestro/flows/profile-add-child.yaml`
- `.maestro/flows/settings-logout.yaml`
- `.maestro/flows/smoke-suite.yaml`

Related docs:

- `docs/stage-8-e2e-testing.md`

## Short summary

Stage 8 should be run with:

- Expo running in one terminal
- Maestro running in another terminal
- a real Android phone connected by USB
- test credentials set as environment variables

This setup lets teammates reproduce the same real-user E2E flows on their own phones.
