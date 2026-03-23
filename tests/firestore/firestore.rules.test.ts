import { readFileSync } from "fs";
import path from "path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

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

  it("denies unauthenticated reads to protected user profiles", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/alice"), {
        displayName: "Alice",
      });
    });

    const anonymousDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anonymousDb, "users/alice")));
  });

  it("blocks unauthenticated writes to protected data", async () => {
    const anonymousDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      setDoc(doc(anonymousDb, "users/alice"), {
        displayName: "Anonymous",
      }),
    );
  });

  it("allows a signed-in parent to manage their own parent profile subtree", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();

    await assertSucceeds(
      setDoc(doc(aliceDb, "parents/alice"), {
        firstName: "Alice",
      }),
    );

    await assertSucceeds(
      setDoc(doc(aliceDb, "parents/alice/children/child-1"), {
        name: "Charlie",
        createdAt: "2026-03-23T00:00:00.000Z",
      }),
    );

    await assertSucceeds(
      setDoc(doc(aliceDb, "parents/alice/sessionMeta/latestEndedSession"), {
        sessionId: "session-1",
        playbackJsonUrl: "https://example.com/replay.json",
      }),
    );

    await assertSucceeds(getDoc(doc(aliceDb, "parents/alice")));
    await assertSucceeds(getDoc(doc(aliceDb, "parents/alice/children/child-1")));
    await assertSucceeds(
      getDoc(doc(aliceDb, "parents/alice/sessionMeta/latestEndedSession")),
    );
  });

  it("denies access to another parent's subtree", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "parents/alice"), {
        firstName: "Alice",
      });
      await setDoc(doc(context.firestore(), "parents/alice/children/child-1"), {
        name: "Charlie",
      });
    });

    const bobDb = testEnv.authenticatedContext("bob").firestore();
    await assertFails(getDoc(doc(bobDb, "parents/alice")));
    await assertFails(getDoc(doc(bobDb, "parents/alice/children/child-1")));
  });

  it("allows a signed-in user to manage their own support collections", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();

    await assertSucceeds(
      setDoc(doc(aliceDb, "users/alice/supportTickets/ticket-1"), {
        subject: "Login issue",
        status: "open",
      }),
    );

    await assertSucceeds(
      setDoc(doc(aliceDb, "users/alice/supportChatMessages/message-1"), {
        sender: "You",
        body: "Need help",
      }),
    );

    await assertSucceeds(getDoc(doc(aliceDb, "users/alice/supportTickets/ticket-1")));
    await assertSucceeds(
      getDoc(doc(aliceDb, "users/alice/supportChatMessages/message-1")),
    );
  });

  it("denies another user access to support collections", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/alice/supportTickets/ticket-1"), {
        subject: "Login issue",
        status: "open",
      });
      await setDoc(
        doc(context.firestore(), "users/alice/supportChatMessages/message-1"),
        {
          sender: "You",
          body: "Need help",
        },
      );
    });

    const bobDb = testEnv.authenticatedContext("bob").firestore();
    await assertFails(getDoc(doc(bobDb, "users/alice/supportTickets/ticket-1")));
    await assertFails(
      getDoc(doc(bobDb, "users/alice/supportChatMessages/message-1")),
    );
  });

  it("blocks unauthenticated reads from protected user support collections", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "users/alice/supportTickets/ticket-1"), {
        subject: "Login issue",
        status: "open",
      });
    });

    const anonymousDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      getDoc(doc(anonymousDb, "users/alice/supportTickets/ticket-1")),
    );
  });

  it("allows play session creation and reads only for the owning parent", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    const sessionRef = doc(collection(aliceDb, "playSessions"));

    await assertSucceeds(
      setDoc(sessionRef, {
        parentId: "alice",
        childId: "child-1",
        status: "active",
      }),
    );

    await assertSucceeds(getDoc(sessionRef));

    const bobDb = testEnv.authenticatedContext("bob").firestore();
    await assertFails(getDoc(doc(bobDb, "playSessions", sessionRef.id)));
  });

  it("blocks creating a play session for a different parent id", async () => {
    const aliceDb = testEnv.authenticatedContext("alice").firestore();
    const sessionRef = doc(collection(aliceDb, "playSessions"));

    await assertFails(
      setDoc(sessionRef, {
        parentId: "bob",
        status: "active",
      }),
    );
  });
});
