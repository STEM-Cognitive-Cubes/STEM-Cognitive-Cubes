export default ({ config }) => ({
  ...config,
  name: config.name ?? "BlokC",
  slug: config.slug ?? "blokc",
  scheme: "blokc",
  ios: {
    ...(config.ios ?? {}),
    bundleIdentifier: "com.blokc.app",
  },
  android: {
    ...(config.android ?? {}),
    package: "com.blokc.app",
  },
  extra: {
    API_BASE_URL: process.env.API_BASE_URL,
    WS_BASE_URL: process.env.WS_BASE_URL,
  },
});
