const { auth } = require('../config/firebase');

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];

    // Development bypass for local emulator testing
    if (process.env.NODE_ENV !== 'production' && token === 'mock-token-123') {
      req.user = { id: 'mock-user-id' };
      return next();
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }
};

module.exports = authMiddleware;
