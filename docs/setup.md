# Setup Guide

This guide is split by platform. Follow the Android section first. iOS is separate below.

========================================
ANDROID SETUP (Windows only)
========================================

Prereqs
- Node.js 18 (see .nvmrc)
- npm
- Expo account (EAS)

1) Install dependencies (PowerShell)
```
npm install
```

2) Install EAS CLI (once)
```
powershell -ExecutionPolicy Bypass -Command "npm i -g eas-cli"
```

3) Login to EAS
```
powershell -ExecutionPolicy Bypass -Command "eas login"
```

4) Firebase config files (shared project)
This repo already includes the Android config file:
- google-services.json

Do NOT edit it unless Firebase config changes. If it changes, update the file in the repo.

5) Build the Android dev client (APK)
```
npx eas-cli build -p android --profile development
```

6) Install the APK
- Open the EAS build link on your phone
- Download and install the APK (allow unknown sources)

7) Run the dev client app
Start Metro:
```
npx expo start --dev-client
```
Open the dev client app on your phone and scan the QR.

8) Navigation dependencies (info)
Install navigation packages (if missing):
```
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```
See docs/navigation-dependencies.md for details.


========================================
IOS SETUP (macOS only)
========================================

Prereqs
- macOS + Xcode
- Apple Developer account
- GoogleService-Info.plist in project root (already added; do not change unless Firebase config changes)

1) Add iOS Firebase config file
Place this file in project root:
- GoogleService-Info.plist

2) Build the iOS dev client
```
eas build -p ios --profile development
```

3) Install and run
- Install the build on your device
- Run Metro:
```
npx expo start --dev-client
```
- Open the dev client app and scan the QR

Navigation packages (if missing):
```
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```
