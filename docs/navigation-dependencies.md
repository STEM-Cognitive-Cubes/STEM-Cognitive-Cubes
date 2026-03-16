# Navigation Dependencies

These packages are used for React Navigation (stack) in this project:

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`

Recommended install (Expo-managed):

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

If bundling errors occur after installing, clear Metro cache:

```bash
npx expo start -c
```

For full setup (Windows/macOS), EAS dev build steps, and Firebase auth
configuration, see `docs/setup.md`.
