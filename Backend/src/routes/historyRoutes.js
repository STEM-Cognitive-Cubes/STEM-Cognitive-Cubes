const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/history/:childId
// Fetch the last 20 play sessions for the specified child
router.get('/:childId', verifyToken, historyController.getHistory);
// GET /api/history/session/:sessionId
// Fetch detailed stats and AI insight for a specific session
router.get('/session/:sessionId', verifyToken, historyController.getSessionDetails);

module.exports = router;
