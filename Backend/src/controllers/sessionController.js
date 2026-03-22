const sessionService = require('../services/sessionService');

const sessionController = {
  createSession: async (req, res) => {
    const { childId, ...sessionData } = req.body;
    
    try {
      if (!childId) {
        return res.status(400).json({ error: 'childId is required' });
      }

      const result = await sessionService.savePlaySession(childId, sessionData);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error creating session:', error);
      return res.status(500).json({ error: 'Failed to create play session' });
    }
  }
};

module.exports = sessionController;
