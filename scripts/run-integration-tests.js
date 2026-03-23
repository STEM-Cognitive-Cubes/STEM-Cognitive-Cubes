const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function findJava21Home() {
  const currentHome = process.env.JAVA_HOME;

  if (currentHome) {
    return currentHome;
  }

  if (process.platform === "win32") {
    const adoptiumRoot = "C:\\Program Files\\Eclipse Adoptium";

    if (fs.existsSync(adoptiumRoot)) {
      const candidates = fs
        .readdirSync(adoptiumRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name.startsWith("jdk-21"))
        .map((entry) => path.join(adoptiumRoot, entry.name))
        .sort()
        .reverse();

      if (candidates.length > 0) {
        return candidates[0];
      }
    }
  }

  return undefined;
}

const repoRoot = path.resolve(__dirname, "..");
const env = {
  ...process.env,
};

const javaHome = findJava21Home();

if (javaHome) {
  env.JAVA_HOME = javaHome;
  env.PATH = `${path.join(javaHome, "bin")}${path.delimiter}${env.PATH ?? ""}`;
}

const firebaseCliScript = path.resolve(__dirname, "firebase-cli.js");
const jestCommand =
  "node ./node_modules/jest/bin/jest.js tests/integration --runInBand --forceExit";

const result = spawnSync(
  process.execPath,
  [
    firebaseCliScript,
    "emulators:exec",
    "--project",
    "blokc-13a99",
    "--only",
    "auth,firestore",
    jestCommand,
  ],
  {
    cwd: repoRoot,
    env,
    stdio: "inherit",
  }
);

process.exit(result.status ?? 1);
