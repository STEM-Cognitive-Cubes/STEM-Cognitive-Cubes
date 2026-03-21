const { db } = require('../config/firebase');

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
    
    return { id: sessionRef.id, ...sessionDoc };
  }
};

module.exports = sessionService;
