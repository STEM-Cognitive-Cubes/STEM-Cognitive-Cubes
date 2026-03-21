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
  },

  getSessionDetails: async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const sessionDocRef = await db.collection('playSessions').doc(sessionId).get();
      if (!sessionDocRef.exists) {
        return res.status(404).json({ error: 'Session not found' });
      }
      const sessionData = sessionDocRef.data();

      const insightSnapshot = await db.collection('insights').where('sessionId', '==', sessionId).limit(1).get();
      const insightData = insightSnapshot.empty ? null : insightSnapshot.docs[0].data();

      const blocksUsedMap = {};
      if (sessionData.cubesConnected) {
        sessionData.cubesConnected.forEach(c => {
          if (!blocksUsedMap[c]) blocksUsedMap[c] = 0;
          blocksUsedMap[c]++;
        });
      }
      const blocksUsedArray = Object.keys(blocksUsedMap).map(k => ({
        id: k, name: `Cube ${k}`, count: blocksUsedMap[k], color: '#FF9F43'
      }));

      const focusData = [];
      const intervals = 8;
      for (let i = 0; i < intervals; i++) {
        focusData.push({
          day: `${(i+1)*5}m`, 
          value: Math.floor(Math.random() * 4) + (insightData ? insightData.problemSolving : 5) 
        });
      }

      let avgFocus = insightData ? insightData.problemSolving : 0;
      let focusLevel = avgFocus > 8 ? "High" : avgFocus > 5 ? "Med" : "Low";
      
      let dateObj = new Date(sessionData.createdAt);

      const formattedData = {
        id: sessionId,
        title: sessionData.structureData ? sessionData.structureData.name : "3D Build Preview",
        dateLabel: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeLabel: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        durationMinutes: Math.floor((sessionData.duration || 0) / 60) + "m",
        blocks: sessionData.cubesConnected ? sessionData.cubesConnected.length : 0,
        focusLevel,
        score: insightData ? insightData.overall.toFixed(1) : "0.0",
        aiInsight: insightData ? insightData.summary : "No insight computed.",
        focusData,
        blocksUsed: blocksUsedArray
      };

      return res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching session details:', error);
      return res.status(500).json({ error: 'Failed to fetch session details' });
    }
  }
};

module.exports = historyController;
