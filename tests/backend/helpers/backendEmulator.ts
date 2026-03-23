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

export async function clearBackendState() {
  const testEnv = await getTestEnv();
  await testEnv.clearFirestore();

  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? "127.0.0.1:9099";
  await fetch(`http://${authHost}/emulator/v1/projects/${projectId}/accounts`, {
    method: "DELETE",
  });

  await signOut(auth).catch(() => undefined);
}

export async function cleanupBackendTestEnv() {
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

export async function getCurrentUserToken() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user available for backend test.");
  }

  return user.getIdToken();
}

export async function seedDocument(
  pathSegments: [string, ...string[]],
  data: Record<string, unknown>
) {
  const testEnv = await getTestEnv();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), ...pathSegments), data);
  });
}

export async function readDocument(pathSegments: [string, ...string[]]) {
  const testEnv = await getTestEnv();
  let data: Record<string, unknown> | undefined;

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDoc(doc(context.firestore(), ...pathSegments));
    data = snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : undefined;
  });

  return data;
}

export async function readCollection(pathSegments: [string, ...string[]]) {
  const testEnv = await getTestEnv();
  let documents: Array<Record<string, unknown> & { id: string }> = [];

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDocs(collection(context.firestore(), ...pathSegments));
    documents = snapshot.docs.map((document) => ({
      id: document.id,
      ...(document.data() as Record<string, unknown>),
    }));
  });

  return documents;
}

export function getFunctionsBaseUrl() {
  return "http://127.0.0.1:5001/blokc-13a99/us-central1";
}

export async function callFunction(
  name: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
    query?: Record<string, string | undefined>;
  } = {}
) {
  const method = options.method ?? "GET";
  const url = new URL(`${getFunctionsBaseUrl()}/${name}`);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json().catch(() => null);

  return {
    status: response.status,
    ok: response.ok,
    json,
  };
}
