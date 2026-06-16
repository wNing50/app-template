const { env } = require('../config/env');
const { readBearerToken } = require('./requireToken');

const requireAdminToken = (req, res, next) => {
  if (!env.adminToken) return next();
  const token = readBearerToken(req.get('authorization')) || req.get('x-admin-token');
  if (token === env.adminToken) return next();
  return res.status(401).json({ error: 'ADMIN_UNAUTHORIZED' });
};

module.exports = { requireAdminToken };
