const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const insightController = require("../controllers/insightController");

// GET /api/insights/weekly/:childId
// Returns day-by-day averaged scores for the past 7 days (for charts)
router.get("/weekly/:childId", verifyToken, insightController.getWeeklyInsights);

// GET /api/insights/summary/:childId
// Returns averaged scores across last 10 sessions + summary text (for insight cards)
router.get("/summary/:childId", verifyToken, insightController.getInsightSummary);

// GET /api/insights/report/:childId
// Generates a downloadable PDF report of the latest insights
router.get("/report/:childId", verifyToken, insightController.generateReport);

// GET /api/insights/historic-weeks/:childId
// Fetch the structured historic weeks summary payload
router.get("/historic-weeks/:childId", verifyToken, insightController.getHistoricWeeks);

module.exports = router;
