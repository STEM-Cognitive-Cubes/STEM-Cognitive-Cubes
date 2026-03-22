const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  testEnvironment: "node",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation/.*|@firebase/.*|firebase/.*))",
  ],
};
