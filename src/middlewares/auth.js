// authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log('----')
  const token = req.headers['authorization']; // Get token from Authorization header
//   console.log(authHeader)
//   const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'myTestKey'; // Replace with your secret or use env
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
