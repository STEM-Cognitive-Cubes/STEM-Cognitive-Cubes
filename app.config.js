export default ({ config }) => ({
  ...config,
  name: config.name ?? "BlokC",
  slug: config.slug ?? "blokc",
  scheme: "blokc",
  plugins: [
    ...(config.plugins ?? []),
    "@react-native-google-signin/google-signin",
  ],
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: "com.blokc.app",
    googleServicesFile: "./GoogleService-Info.plist",
  },
  android: {
    ...(config.android ?? {}),
    package: "com.blokc.app",
    googleServicesFile: "./google-services.json",
  },
  extra: {
    eas: {
      projectId: "80fd15b1-a616-45e9-9eee-462d89714b94",
    },
    API_BASE_URL: process.env.API_BASE_URL,
    WS_BASE_URL: process.env.WS_BASE_URL,
  },
});
