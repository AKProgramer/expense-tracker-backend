// utils/jwt.js
const jwt = require('jsonwebtoken');


// Generate Token
exports.generateToken = (payload) => {
  
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
};

// Middleware to Verify Token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
