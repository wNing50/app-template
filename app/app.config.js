const appJson = require('./app.json');
const pkg = require('./package.json');

const asText = (value) => (typeof value === 'string' ? value.trim() : '');

const resolveVersion = () => {
  const envVersion = asText(process.env.APP_VERSION);
  if (envVersion) return envVersion;
  const pkgVersion = asText(pkg.version);
  if (pkgVersion) return pkgVersion;
  const appJsonVersion = asText(appJson?.expo?.version);
  return appJsonVersion || '0.0.1';
};

module.exports = {
  ...appJson,
  expo: {
    ...appJson.expo,
    version: resolveVersion(),
  },
};

