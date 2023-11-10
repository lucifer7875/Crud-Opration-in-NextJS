const jwt = require('jsonwebtoken');

// Middleware function to check if a valid JWT token is provided
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.substring('Bearer '.length);

  // Check if a token is provided
  if (!token) {
    return res.status(401).json({ error: 'You are not authorized.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    req.userId = decoded.userId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
