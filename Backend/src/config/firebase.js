const admin = require('firebase-admin');

// Firebase config module
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
