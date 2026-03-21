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
      
      // Since Firebase is not yet fully configured with a service account json,
      // we provide mock data immediately so the UI is fully visible in Android Studio.

      if (sessionId === "2") {
        return res.status(200).json({
          id: "2",
          title: "Robot Prototype",
          dateLabel: "Dec 29, 2025",
          timeLabel: "10:30 AM",
          durationMinutes: "33m",
          blocks: 7,
          focusLevel: "Med",
          score: "7.5",
          aiInsight: "Explored building a robot showing imaginative assembly sequences.",
          focusData: [
            { day: "5m", value: 6 }, { day: "10m", value: 7 }, { day: "15m", value: 6 },
            { day: "20m", value: 8 }, { day: "25m", value: 9 }, { day: "30m", value: 7 },
            { day: "35m", value: 8 }, { day: "40m", value: 6 }
          ],
          blocksUsed: [
            { id: "1", name: "Cube 1", count: 1, color: "#FF9F43" },
            { id: "2", name: "Cube 2", count: 1, color: "#FF9F43" },
            { id: "3", name: "Cube 3", count: 1, color: "#FF9F43" },
            { id: "4", name: "Cube 4", count: 1, color: "#FF9F43" },
            { id: "5", name: "Cube 5", count: 1, color: "#FF9F43" },
            { id: "6", name: "Cube 6", count: 1, color: "#FF9F43" },
            { id: "7", name: "Cube 7", count: 1, color: "#FF9F43" }
          ]
        });
      }

      // Default mock fallback
      return res.status(200).json({
        id: sessionId,
        title: "3D Build Preview",
        dateLabel: "Dec 30, 2025",
        timeLabel: "04:30 PM",
        durationMinutes: "45m",
        blocks: 12,
        focusLevel: "High",
        score: "8.5",
        aiInsight: "Sanuki showed excellent spatial awareness today. She built a stable base before expanding vertically, indicating improved planning skills.",
        focusData: [
          { day: "5m", value: 5 }, { day: "10m", value: 6 }, { day: "15m", value: 8 }, 
          { day: "20m", value: 5 }, { day: "25m", value: 9 }, { day: "30m", value: 8 }, 
          { day: "35m", value: 6 }, { day: "40m", value: 7 }
        ],
        blocksUsed: [
          { id: "1", name: "Cube 1", count: 4, color: "#FF9F43" },
          { id: "2", name: "Cube 2", count: 2, color: "#FF9F43" },
          { id: "3", name: "Cube 3", count: 2, color: "#FF9F43" },
          { id: "4", name: "Cube 4", count: 2, color: "#FF9F43" },
          { id: "5", name: "Cube 5", count: 2, color: "#FF9F43" }
        ]
      });
      
    } catch (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ error: 'Failed to fetch play history' });
    }
  }
};

module.exports = historyController;
