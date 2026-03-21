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
    
    return { id: sessionRef.id, ...sessionDoc, insights };
  }
};

module.exports = sessionService;
