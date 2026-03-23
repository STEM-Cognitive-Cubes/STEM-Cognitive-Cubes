module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/tests/jest/setup.ts"],
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.tsx"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/firestore/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^firebase/app$": "<rootDir>/node_modules/firebase/app/dist/index.cjs.js",
    "^firebase/auth$": "<rootDir>/node_modules/firebase/auth/dist/index.cjs.js",
    "^firebase/firestore$":
      "<rootDir>/node_modules/firebase/firestore/dist/index.cjs.js",
    "^@firebase/app$": "<rootDir>/node_modules/@firebase/app/dist/index.cjs.js",
    "^@firebase/auth$":
      "<rootDir>/node_modules/@firebase/auth/dist/node/index.js",
    "^@firebase/component$":
      "<rootDir>/node_modules/@firebase/component/dist/index.cjs.js",
    "^@firebase/logger$":
      "<rootDir>/node_modules/@firebase/logger/dist/index.cjs.js",
    "^@firebase/util$":
      "<rootDir>/node_modules/@firebase/util/dist/index.node.cjs.js",
    "^@firebase/firestore$":
      "<rootDir>/node_modules/@firebase/firestore/dist/index.node.cjs.js",
    "^@firebase/util/dist/postinstall.mjs$":
      "<rootDir>/tests/jest/firebasePostinstallMock.ts",
    "\\.(gif|jpg|jpeg|png|svg)$": "<rootDir>/tests/jest/fileMock.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-native-safe-area-context|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@react-navigation/.*|firebase|@firebase/.*))",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
};
