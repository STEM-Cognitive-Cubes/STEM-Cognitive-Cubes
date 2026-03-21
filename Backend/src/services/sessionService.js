const { db } = require('../config/firebase');
const { calculateInsights } = require('./insightService');

// Session service
const sessionService = {
  savePlaySession: async (childId, sessionData) => {
    const sessionRef = db.collection('playSessions').doc();
    const sessionDoc = {
      childId,
      ...sessionData,
      createdAt: new Date().toISOString()
    };
    
    await sessionRef.set(sessionDoc);
    
    // Calculate insights automatically
    const insights = calculateInsights(sessionData);
    
    // Save insights to Firestore
    const insightRef = db.collection('insights').doc();
    const insightDoc = {
      childId,
      sessionId: sessionRef.id,
      ...insights,
      createdAt: new Date().toISOString()
    };
    await insightRef.set(insightDoc);
    
    return { session: { id: sessionRef.id, ...sessionDoc }, insight: { id: insightRef.id, ...insightDoc } };
  }
};

module.exports = sessionService;
