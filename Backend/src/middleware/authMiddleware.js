const authMiddleware = {
  verifyToken: (req, res, next) => {
    // Basic mock for token verification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    // In a real app we would use admin.auth().verifyIdToken()
    // For now we just pass through
    req.user = { id: 'mock-user-id' };
    next();
  }
};

module.exports = authMiddleware;
