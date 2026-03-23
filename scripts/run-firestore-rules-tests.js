const { spawnSync } = require("child_process");
const fs = require("fs");
const net = require("net");
const path = require("path");

process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || "blokc-13a99";

const firebaseCliScript = path.resolve(__dirname, "firebase-cli.js");
const jestBin = path.resolve(__dirname, "../node_modules/jest/bin/jest.js");
const jestConfig = path.resolve(__dirname, "../jest.rules.config.js");
const rulesTestPath = path.resolve(
  __dirname,
  "../tests/firestore/firestore.rules.test.ts",
);
const firebaseConfigPath = path.resolve(__dirname, "../firebase.json");
const tempConfigPath = path.resolve(
  __dirname,
  "../.firebase-config/firebase.rules.test.json",
);

function getOpenPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not determine open port.")));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });
}

async function main() {
  const javaCheck = spawnSync("java", ["-version"], {
    stdio: "ignore",
    env: process.env,
  });

  if (javaCheck.error || javaCheck.status !== 0) {
    console.error(
      "Firestore emulator requires Java on PATH. Run `java -version` and install Java if it is missing.",
    );
    process.exit(1);
  }

  const firestorePort = await getOpenPort();
  process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${firestorePort}`;

  const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
  firebaseConfig.firestore = firebaseConfig.firestore || {};
  firebaseConfig.firestore.rules = path.resolve(__dirname, "../firestore.rules");
  firebaseConfig.firestore.indexes = path.resolve(
    __dirname,
    "../firestore.indexes.json",
  );
  firebaseConfig.emulators = firebaseConfig.emulators || {};
  firebaseConfig.emulators.firestore = {
    ...(firebaseConfig.emulators.firestore || {}),
    host: "127.0.0.1",
    port: firestorePort,
  };
  fs.writeFileSync(tempConfigPath, JSON.stringify(firebaseConfig, null, 2));

  const result = spawnSync(
    process.execPath,
    [
      firebaseCliScript,
      "emulators:exec",
      "--config",
      tempConfigPath,
      "--only",
      "firestore",
      `"${process.execPath}" "${jestBin}" --config "${jestConfig}" --runInBand --runTestsByPath "${rulesTestPath}"`,
    ],
    {
      stdio: "inherit",
      env: process.env,
    },
  );

  process.exit(result.status ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
