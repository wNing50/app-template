const express = require('express');
const { requireAdminToken } = require('../middleware/requireAdminToken');

const adminRoutes = express.Router();

adminRoutes.get('/admin/health', requireAdminToken, (req, res) => {
  res.json({ ok: true, area: 'admin' });
});

module.exports = { adminRoutes };
