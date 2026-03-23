import { readFileSync } from "fs";
import path from "path";

import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { auth } from "@/services/firebase";

const projectId = "blokc-13a99";
const rules = readFileSync(
  path.resolve(__dirname, "../../../firestore.rules"),
  "utf8"
);

let testEnvPromise: Promise<RulesTestEnvironment> | undefined;

function getFirestoreHostParts() {
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8780";
  const [host, port] = firestoreHost.split(":");

  return {
    host,
    port: Number(port),
  };
}

async function getTestEnv() {
  if (!testEnvPromise) {
    const { host, port } = getFirestoreHostParts();

    testEnvPromise = initializeTestEnvironment({
      projectId,
      firestore: {
        host,
        port,
        rules,
      },
    });
  }

  return testEnvPromise;
}

export async function clearIntegrationState() {
  const testEnv = await getTestEnv();
  await testEnv.clearFirestore();

  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
  await fetch(`http://${authHost}/emulator/v1/projects/${projectId}/accounts`, {
    method: "DELETE",
  });

  await signOut(auth).catch(() => undefined);
}

export async function cleanupIntegrationTestEnv() {
  if (!testEnvPromise) {
    return;
  }

  const testEnv = await testEnvPromise;
  await testEnv.cleanup();
  testEnvPromise = undefined;
}

export async function createSignedInUser(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  return credential.user;
}

export async function signInAs(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutCurrentUser() {
  await signOut(auth).catch(() => undefined);
}

export async function seedUserDoc(uid: string, data: Record<string, unknown>) {
  const testEnv = await getTestEnv();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users", uid), data);
  });
}

export async function seedParentDoc(uid: string, data: Record<string, unknown>) {
  const testEnv = await getTestEnv();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "parents", uid), data);
  });
}

export async function readDocument(pathSegments: string[]) {
  const testEnv = await getTestEnv();
  let data: Record<string, unknown> | undefined;

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDoc(
      doc(context.firestore(), ...(pathSegments as [string, ...string[]]))
    );
    data = snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : undefined;
  });

  return data;
}

export async function readCollection(pathSegments: string[]) {
  const testEnv = await getTestEnv();
  let documents: Array<Record<string, unknown> & { id: string }> = [];

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDocs(
      collection(context.firestore(), ...(pathSegments as [string, ...string[]]))
    );
    documents = snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Record<string, unknown>),
    }));
  });

  return documents;
}
