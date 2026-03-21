const { db } = require('../config/firebase');

const insightController = {
  getWeeklyInsights: async (req, res) => {
    try {
      const { childId } = req.params;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const insightsSnapshot = await db.collection('insights')
        .where('childId', '==', childId)
        .where('createdAt', '>=', sevenDaysAgo.toISOString())
        .get();
        
      if (insightsSnapshot.empty) {
        return res.status(200).json([]);
      }
      
      const insights = insightsSnapshot.docs.map(doc => doc.data());
      return res.status(200).json(insights);
    } catch (error) {
      console.error('Error fetching weekly insights:', error);
      return res.status(500).json({ error: 'Failed to fetch weekly insights' });
    }
  },
  getInsightSummary: async (req, res) => {
    // pending
  }
};

module.exports = insightController;