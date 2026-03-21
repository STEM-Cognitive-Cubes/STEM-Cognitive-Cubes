const admin = require('firebase-admin');

// Firebase config module
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

module.exports = { db };
