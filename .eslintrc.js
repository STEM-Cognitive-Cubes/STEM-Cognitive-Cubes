module.exports = {
  root: true,
  extends: ["@react-native"],
  overrides: [
    {
      files: [
        "tests/**/*.{ts,tsx,js,jsx}",
        ".eslintrc.js",
        "babel.config.js",
        "jest.config.js",
        "jest.rules.config.js",
        "scripts/**/*.js",
      ],
      env: {
        jest: true,
        node: true,
      },
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
};
