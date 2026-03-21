const sessionService = require('../services/sessionService');

const sessionController = {
  createSession: async (req, res) => {
    const { childId, ...sessionData } = req.body;
    
    if (!childId) {
      return res.status(400).json({ error: 'childId is required' });
    }

    const result = await sessionService.savePlaySession(childId, sessionData);
    return res.status(201).json(result);
  }
};

module.exports = sessionController;
