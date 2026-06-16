const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { requestLogger } = require('./middleware/requestLogger');
const { healthRoutes } = require('./routes/healthRoutes');
const { authRoutes } = require('./routes/authRoutes');
const { adminRoutes } = require('./routes/adminRoutes');
const { publicConfigRoutes } = require('./routes/publicConfigRoutes');

const normalizeBasePath = (value) => {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) return '';
  const withLeading = text.startsWith('/') ? text : `/${text}`;
  return withLeading.replace(/\/+$/, '');
};

const mountRoutes = (target) => {
  target.use(healthRoutes);
  target.use(publicConfigRoutes);
  target.use(authRoutes);
  target.use(adminRoutes);
};

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);

  const apiBasePath = normalizeBasePath(env.apiBasePath);
  if (apiBasePath) {
    const router = express.Router();
    mountRoutes(router);
    app.use(apiBasePath, router);
  } else {
    mountRoutes(app);
  }

  return app;
};

module.exports = { createApp, normalizeBasePath };
