import { initializeApp, getApps } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectAuthEmulator, getAuth, initializeAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBMP6EbL88-bq5mHRHcw8zRmLCYmsT7W6U",
  authDomain: "blokc-13a99.firebaseapp.com",
  projectId: "blokc-13a99",
  storageBucket: "blokc-13a99.firebasestorage.app",
  messagingSenderId: "897405902939",
  appId: "1:897405902939:web:c9a0e7c8770ce067d1df7e",
  measurementId: "G-M1VVVC39WQ",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

function initAuth() {
  try {
    const authModule = require("firebase/auth") as {
      getReactNativePersistence?: (
        storage: typeof AsyncStorage
      ) => unknown;
    };
    const persistenceFactory = authModule.getReactNativePersistence;
    if (typeof persistenceFactory !== "function") {
      return getAuth(app);
    }

    return initializeAuth(app, {
      persistence: persistenceFactory(AsyncStorage) as never,
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = initAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

declare global {
  // eslint-disable-next-line no-var
  var __blokcFirebaseEmulatorsConnected__: boolean | undefined;
}

function connectFirebaseEmulatorsIfNeeded() {
  const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST;

  if ((!authHost && !firestoreHost) || globalThis.__blokcFirebaseEmulatorsConnected__) {
    return;
  }

  if (authHost) {
    connectAuthEmulator(auth, `http://${authHost}`, {
      disableWarnings: true,
    });
  }

  if (firestoreHost) {
    const [host, port] = firestoreHost.split(":");
    connectFirestoreEmulator(db, host, Number(port));
  }

  globalThis.__blokcFirebaseEmulatorsConnected__ = true;
}

connectFirebaseEmulatorsIfNeeded();
