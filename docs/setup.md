# Setup Guide

This guide is split by platform. Follow the Android section first. iOS is separate below.

========================================
ANDROID SETUP (Windows only)
========================================

Prereqs
- Node.js 20 LTS (20.19.4 recommended; see .nvmrc)
- npm
- Expo account (EAS)

Important Windows notes
- Use PowerShell or Command Prompt for Windows-specific commands.
- If you use Git Bash, `rm -rf` works there, but PowerShell commands like `Remove-Item` do not.
- This repo is inside OneDrive. If `npm install` fails with `EBUSY` on `.gradle` lock files, pause OneDrive sync and close all terminals before retrying.
- If `npx expo start --dev-client` fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME` while loading `metro.config.js`, you are likely on Node 24. Switch back to Node 20.

1) Verify Node and npm
PowerShell:
```powershell
node -v
npm -v
```
Expected:
```text
v20.19.4
```

2) Install dependencies
PowerShell:
```
npm install
```

If `npm install` fails with `EBUSY` on `node_modules/@react-native/gradle-plugin/.gradle` or `android/.gradle`, run:
```powershell
Remove-Item -Recurse -Force node_modules\@react-native\gradle-plugin\.gradle
Remove-Item -Recurse -Force android\.gradle
npm install
```

Git Bash equivalent:
```bash
rm -rf node_modules/@react-native/gradle-plugin/.gradle
rm -rf android/.gradle
npm install
```

If the lock cannot be removed, close VS Code, Android Studio, and any Java/Node terminals still running. On this project the lock is typically held by a Java/Gradle background process on Windows, not by EAS itself.

3) Install EAS CLI (once)
```
powershell -ExecutionPolicy Bypass -Command "npm i -g eas-cli"
```

4) Login to EAS
```
powershell -ExecutionPolicy Bypass -Command "eas login"
```

5) Firebase config files (shared project)
This repo already includes the Android config file:
- google-services.json

Do NOT edit it unless Firebase config changes. If it changes, update the file in the repo.

6) Build the Android dev client (APK)
```
npx eas-cli build -p android --profile development
```

7) Install the APK
- Open the EAS build link on your phone
- Download and install the APK (allow unknown sources)

8) Run the dev client app
Start Metro:
```
npx expo start --dev-client
```
Open the dev client app on your phone and scan the QR.

9) Navigation dependencies (info)
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
