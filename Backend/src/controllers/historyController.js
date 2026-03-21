const { db } = require('../config/firebase');

const historyController = {
  getHistory: async (req, res) => {
    const { childId } = req.params;
    
    const sessionsSnapshot = await db.collection('playSessions')
      .where('childId', '==', childId)
      .orderBy('createdAt', 'desc')
      .limit(20) // Get last 20 sessions for history
      .get();
      
    if (sessionsSnapshot.empty) {
      return res.status(200).json([]);
    }
    
    const sessions = sessionsSnapshot.docs.map(doc => doc.data());
    return res.status(200).json(sessions);
  }
};

module.exports = historyController;
