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
    try {
      const { childId } = req.params;
      
      const insightsSnapshot = await db.collection('insights')
        .where('childId', '==', childId)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
        
      if (insightsSnapshot.empty) {
        return res.status(200).json({ message: 'No insights available yet' });
      }
      
      const insights = insightsSnapshot.docs.map(doc => doc.data());
      
      const totals = insights.reduce((acc, curr) => ({
        cognitive: acc.cognitive + curr.cognitive,
        problemSolving: acc.problemSolving + curr.problemSolving,
        creativity: acc.creativity + curr.creativity,
        overall: acc.overall + curr.overall
      }), { cognitive: 0, problemSolving: 0, creativity: 0, overall: 0 });
      
      const count = insights.length;
      const averageSummary = {
        cognitive: parseFloat((totals.cognitive / count).toFixed(2)),
        problemSolving: parseFloat((totals.problemSolving / count).toFixed(2)),
        creativity: parseFloat((totals.creativity / count).toFixed(2)),
        overall: parseFloat((totals.overall / count).toFixed(2)),
        sessionCount: count,
        latestSummary: insights[0].summary
      };

      return res.status(200).json(averageSummary);
    } catch (error) {
      console.error('Error fetching insight summary:', error);
      return res.status(500).json({ error: 'Failed to fetch insight summary' });
    }
  },
  
  generateReport: async (req, res) => {
    try {
      const { childId } = req.params;
      
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument();
      
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Length', Buffer.byteLength(pdfData));
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=insight_report_${childId}.pdf`);
        res.end(pdfData);
      });
      
      const insightsSnapshot = await db.collection('insights')
        .where('childId', '==', childId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
        
      let latestInsight = null;
      if (!insightsSnapshot.empty) {
        latestInsight = insightsSnapshot.docs[0].data();
      }

      doc.fontSize(20).text('Cognitive Play Insights Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(14).text(`Child ID: ${childId}`);
      doc.moveDown();
      
      if (latestInsight) {
        doc.fontSize(12).text(`Date: ${new Date(latestInsight.createdAt).toLocaleDateString()}`);
        doc.moveDown();
        doc.fontSize(14).text('Performance Metrics', { underline: true });
        doc.fontSize(12).text(`Cognitive Score: ${latestInsight.cognitive}`);
        doc.text(`Problem Solving Score: ${latestInsight.problemSolving}`);
        doc.text(`Creativity Score: ${latestInsight.creativity}`);
        doc.text(`Overall Score: ${latestInsight.overall}`);
        doc.moveDown();
        doc.fontSize(14).text('Summary Feedback', { underline: true });
        doc.fontSize(12).text(latestInsight.summary);
      } else {
        doc.text('No play sessions recorded yet.');
      }
      
      doc.end();

    } catch (error) {
      console.error('Error generating report:', error);
      return res.status(500).json({ error: 'Failed to generate report' });
    }
  },

  getHistoricWeeks: async (req, res) => {
    try {
      const { childId } = req.params;
      
      const [sessionsSnapshot, insightsSnapshot] = await Promise.all([
        db.collection('playSessions').where('childId', '==', childId).get(),
        db.collection('insights').where('childId', '==', childId).get()
      ]);
      
      if (sessionsSnapshot.empty) return res.status(200).json([]);
      
      const insightsMap = {};
      insightsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        insightsMap[data.sessionId] = data;
      });

      const sessions = sessionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, insight: insightsMap[doc.id] };
      }).filter(s => s.insight);

      // Group by week (ISO week or rough 7-day windows based on the latest session)
      // Since it's a mock, we group by calendar week
      const getWeekNumber = (d) => {
        const date = new Date(d);
        date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
        return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
      };

      const weeksMap = {};
      sessions.forEach(session => {
        const date = new Date(session.createdAt);
        const viewWeekStr = `Week ${getWeekNumber(date)}, ${date.getFullYear()}`;
        if (!weeksMap[viewWeekStr]) {
          weeksMap[viewWeekStr] = {
            id: viewWeekStr,
            title: viewWeekStr,
            startDate: date,
            sessions: []
          };
        }
        weeksMap[viewWeekStr].sessions.push(session);
        if (date < weeksMap[viewWeekStr].startDate) {
          weeksMap[viewWeekStr].startDate = date;
        }
      });

      const weeksArray = Object.values(weeksMap).sort((a,b) => b.startDate - a.startDate);

      const result = weeksArray.map(week => {
        let totalDuration = 0;
        let totalBlocks = 0;
        let sumCognitive = 0;
        let sumFocus = 0;
        let sumScore = 0;
        const focusData = [];
        const blocksUsedMap = {};

        week.sessions.forEach(s => {
          totalDuration += s.duration || 0;
          const blocksCount = s.cubesConnected ? s.cubesConnected.length : 0;
          totalBlocks += blocksCount;
          sumCognitive += s.insight.cognitive || 0;
          sumFocus += s.insight.problemSolving || 0;
          sumScore += s.insight.overall || 0;
          
          const dayName = new Date(s.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
          focusData.push({ day: dayName, value: s.insight.problemSolving || 0 });

          if (s.cubesConnected) {
            s.cubesConnected.forEach(c => {
              if (!blocksUsedMap[c]) blocksUsedMap[c] = 0;
              blocksUsedMap[c]++;
            });
          }
        });

        const count = week.sessions.length;
        const blocksUsedArray = Object.keys(blocksUsedMap).map(k => ({
          id: k, name: `Cube ${k}`, count: blocksUsedMap[k], color: '#B860FF'
        }));

        let avgFocus = sumFocus / count;
        let focusLevel = avgFocus > 8 ? "High" : avgFocus > 5 ? "Med" : "Low";

        let mainInsight = count > 0 ? week.sessions[week.sessions.length - 1].insight.summary : "No insight computed.";

        return {
          id: week.id,
          title: week.title,
          dateLabel: `${week.startDate.toLocaleDateString()}`,
          durationMinutes: Math.floor(totalDuration / 60) + "m",
          blocks: totalBlocks,
          focusLevel,
          score: (sumScore / count).toFixed(1),
          aiInsight: mainInsight,
          focusData,
          blocksUsed: blocksUsedArray
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching historic weeks:', error);
      return res.status(500).json({ error: 'Failed to fetch historic weeks' });
    }
  }
};

module.exports = insightController;