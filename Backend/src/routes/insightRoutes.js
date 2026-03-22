const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const insightController = require("../controllers/insightController");

// GET /api/insights/weekly/:childId
// Returns day-by-day averaged scores for the past 7 days (for charts)
const handleWeeklyInsights = (req, res, next) => {
    if (insightController && typeof insightController.getWeeklyInsights === "function") {
        return insightController.getWeeklyInsights(req, res, next);
    }
    return res.status(501).json({ message: "getWeeklyInsights is not implemented" });
};
router.get("/weekly/:childId", verifyToken, handleWeeklyInsights);

// GET /api/insights/summary/:childId
// Returns averaged scores across last 10 sessions + summary text (for insight cards)
const handleInsightSummary = (req, res, next) => {
    if (insightController && typeof insightController.getInsightSummary === "function") {
        return insightController.getInsightSummary(req, res, next);
    }
    return res.status(501).json({ message: "getInsightSummary is not implemented" });
};
router.get("/summary/:childId", verifyToken, handleInsightSummary);

// GET /api/insights/report/:childId
// Generates a downloadable PDF report of the latest insights
router.get("/report/:childId", verifyToken, insightController.generateReport);

module.exports = router;
