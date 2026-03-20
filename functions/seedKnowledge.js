const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

const { knowledgeSeedData } = require("./knowledgeSeedData");

if (!admin.apps.length) {
  admin.initializeApp();
}

async function seedKnowledge() {
  const db = admin.firestore();
  const batch = db.batch();

  for (const item of knowledgeSeedData) {
    const ref = db.collection("botKnowledge").doc(item.id);
    batch.set(
      ref,
      {
        title: item.title,
        keywords: item.keywords,
        content: item.content,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
  console.log(`Seeded ${knowledgeSeedData.length} botKnowledge documents.`);
}

seedKnowledge().catch((error) => {
  console.error("Failed to seed bot knowledge.", error);
  process.exitCode = 1;
});
