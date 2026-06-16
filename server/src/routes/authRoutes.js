const express = require('express');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { requireToken } = require('../middleware/requireToken');

const authRoutes = express.Router();

authRoutes.post('/auth/login', (req, res) => {
  const email = String(req.body?.email || 'demo@example.com').trim();
  const token = jwt.sign({ sub: email, role: 'user' }, env.jwtSecret, { expiresIn: '7d' });
  res.json({
    token,
    user: {
      id: email,
      email,
      name: 'Template User',
    },
  });
});

authRoutes.get('/me', requireToken, (req, res) => {
  res.json({
    id: 'template-user',
    email: 'demo@example.com',
    name: 'Template User',
  });
});

module.exports = { authRoutes };
