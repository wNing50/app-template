const express = require('express');
const { env } = require('../config/env');

const publicConfigRoutes = express.Router();

publicConfigRoutes.get('/public/config', (req, res) => {
  res.json({
    environment: env.nodeEnv,
    apiBasePath: env.apiBasePath,
  });
});

module.exports = { publicConfigRoutes };
