const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth, signToken } = require('../middleware/auth');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ error: 'Invalid email address.' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const id = uuidv4();
    const newUser = await User.create({
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    const token = signToken(id);

    res.status(201).json({ success: true, token, user: userObj });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    const token = signToken(user.id);
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, token, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// GET /api/auth/me — get current user
router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
