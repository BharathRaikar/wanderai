const jwt = require('jsonwebtoken');
const { getUserById } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'wanderai-secret-key-change-in-production';

// Required auth — returns 401 if missing/invalid
function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// Optional auth — attaches user if present but doesn't block
function optionalAuth(req, _res, next) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = getUserById(payload.userId) || null;
    } catch {
      req.user = null;
    }
  }
  next();
}

function extractToken(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { requireAuth, optionalAuth, signToken, JWT_SECRET };
