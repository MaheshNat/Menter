const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  // Check for token
  if (!token) return res.status(401).json({ message: 'NO_TOKEN_PROVIDED' });
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: 'INVALID_TOKEN' });
  }
};

module.exports = auth;
