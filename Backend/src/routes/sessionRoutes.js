const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, sessionController.createSession);

module.exports = router;
