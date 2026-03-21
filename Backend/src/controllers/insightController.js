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
      
      // Group by day and average
      const dailyAverages = {};
      insights.forEach(insight => {
        const day = new Date(insight.createdAt).toISOString().split('T')[0];
        if (!dailyAverages[day]) {
          dailyAverages[day] = { count: 0, cognitive: 0, problemSolving: 0, creativity: 0, overall: 0 };
        }
        dailyAverages[day].count += 1;
        dailyAverages[day].cognitive += insight.cognitive;
        dailyAverages[day].problemSolving += insight.problemSolving;
        dailyAverages[day].creativity += insight.creativity;
        dailyAverages[day].overall += insight.overall;
      });

      const result = Object.keys(dailyAverages).map(day => {
        const data = dailyAverages[day];
        return {
          date: day,
          cognitive: parseFloat((data.cognitive / data.count).toFixed(2)),
          problemSolving: parseFloat((data.problemSolving / data.count).toFixed(2)),
          creativity: parseFloat((data.creativity / data.count).toFixed(2)),
          overall: parseFloat((data.overall / data.count).toFixed(2))
        };
      });

      return res.status(200).json(result.sort((a, b) => new Date(a.date) - new Date(b.date)));
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