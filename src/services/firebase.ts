import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

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

export const auth = getAuth(app);
