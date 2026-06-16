const { env } = require('../config/env');

const readBearerToken = (header) => {
  const value = typeof header === 'string' ? header.trim() : '';
  if (!value.toLowerCase().startsWith('bearer ')) return '';
  return value.slice(7).trim();
};

const requireToken = (req, res, next) => {
  if (!env.apiToken) return next();
  const token = readBearerToken(req.get('authorization')) || req.get('x-api-token');
  if (token === env.apiToken) return next();
  return res.status(401).json({ error: 'UNAUTHORIZED' });
};

module.exports = { requireToken, readBearerToken };
