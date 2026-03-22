import { readFileSync } from "fs";
import path from "path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const projectId = "blokc-13a99";
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8780";
const [host, port] = firestoreHost.split(":");
const rules = readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8");

describe("Firestore security rules", () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        host,
        port: Number(port),
        rules,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("allows a signed-in parent to read their own profile", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/alice"), {
        displayName: "Alice",
      });
    });

    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    await assertSucceeds(getDoc(doc(aliceDb, "users/alice")));
  });

  it("denies access to another parent's profile", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/alice"), {
        displayName: "Alice",
      });
    });

    const bobDb = testEnv.authenticatedContext("bob").firestore();
    await assertFails(getDoc(doc(bobDb, "users/alice")));
  });

  it("blocks unauthenticated writes to protected data", async () => {
    const anonymousDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      setDoc(doc(anonymousDb, "users/alice"), {
        displayName: "Anonymous",
      }),
    );
  });
});
