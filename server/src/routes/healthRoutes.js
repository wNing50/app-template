const express = require('express');

const healthRoutes = express.Router();

healthRoutes.get('/health', (req, res) => {
  res.json({ ok: true, service: 'app-template-server' });
});

module.exports = { healthRoutes };
