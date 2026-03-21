const { db } = require('../config/firebase');

const historyController = {
  getHistory: async (req, res) => {
    try {
      const { childId } = req.params;
      
      const sessionsSnapshot = await db.collection('playSessions')
        .where('childId', '==', childId)
        .orderBy('createdAt', 'desc')
        .limit(20) // Get last 20 sessions for history
        .get();
        
      if (sessionsSnapshot.empty) {
        return res.status(200).json([]);
      }
      
      const historyData = sessionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.createdAt,
          timeTakenMinutes: Math.floor(data.duration / 60) + "m " + (data.duration % 60) + "s",
          rawDurationSeconds: data.duration,
          cubesConnectedCount: data.cubesConnected ? data.cubesConnected.length : 0,
          structureDetected: data.structureData ? data.structureData.name : "Unknown",
          isUniqueBuild: data.structureData ? data.structureData.isUnique : false
        };
      });
      return res.status(200).json(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ error: 'Failed to fetch play history' });
    }
  }
};

module.exports = historyController;
