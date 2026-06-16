const dotenv = require('dotenv');

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 8888),
  apiBasePath: process.env.API_BASE_PATH || '',
  apiToken: process.env.API_TOKEN || '',
  adminToken: process.env.ADMIN_TOKEN || '',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret',
  databaseUrl: process.env.DATABASE_URL || '',
};

module.exports = { env };
