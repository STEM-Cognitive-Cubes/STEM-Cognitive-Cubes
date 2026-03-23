const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const configHome = path.resolve(__dirname, "../.firebase-config");
fs.mkdirSync(configHome, { recursive: true });

const firebaseBin = require.resolve("firebase-tools/lib/bin/firebase.js");
const result = spawnSync(process.execPath, [firebaseBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    XDG_CONFIG_HOME: configHome,
  },
});

process.exit(result.status ?? 1);
