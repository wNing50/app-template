const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const APP_ANDROID_LATEST_VERSION_KEY = 'APP_ANDROID_LATEST_VERSION';

const getGradleExecutable = (platform = process.platform) =>
  platform === 'win32' ? 'gradlew.bat' : './gradlew';

const getSpawnOptions = (platform = process.platform) => ({
  shell: platform === 'win32',
});

const resolveAppEnv = (value) => {
  const next = typeof value === 'string' ? value.trim() : '';
  return ['cloud', 'dev', 'local'].includes(next) ? next : 'cloud';
};

const createBuildEnv = (baseEnv = process.env) => ({
  ...baseEnv,
  APP_ENV: resolveAppEnv(baseEnv.APP_ENV),
  APP_VERSION: typeof baseEnv.APP_VERSION === 'string' ? baseEnv.APP_VERSION.trim() : '',
  NODE_ENV: 'production',
  EXPO_NO_DOTENV: '1',
});

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const parseDevVersion = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  const match = raw.match(/^(\d+\.\d+\.\d+)(?:-dev(\d+))?$/);
  if (!match) return null;
  return {
    base: match[1],
    dev: match[2] ? Number(match[2]) : null,
  };
};

const resolveBuildVersion = ({ appEnv, packageVersion, latestVersion }) => {
  const parsedPkg = parseDevVersion(packageVersion);
  const pkgBase = parsedPkg ? parsedPkg.base : String(packageVersion || '').trim();
  if (!pkgBase) throw new Error('package.json version is empty');

  if (appEnv !== 'dev') return pkgBase;

  const parsedLatest = parseDevVersion(latestVersion);
  if (parsedLatest && parsedLatest.base === pkgBase && Number.isInteger(parsedLatest.dev) && parsedLatest.dev >= 1) {
    return `${pkgBase}-dev${parsedLatest.dev + 1}`;
  }
  return `${pkgBase}-dev1`;
};

const readEnvVarFromFile = (filePath, key) => {
  if (!fs.existsSync(filePath)) return '';
  const text = fs.readFileSync(filePath, 'utf8');
  const line = text.split(/\r?\n/).find((row) => row.startsWith(`${key}=`));
  return line ? line.slice(key.length + 1).trim() : '';
};

const upsertEnvVarInFile = (filePath, key, value) => {
  const normalized = String(value ?? '').trim();
  const text = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const lines = text ? text.split(/\r?\n/) : [];
  let found = false;
  const next = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${normalized}`;
    }
    return line;
  });
  if (!found) next.push(`${key}=${normalized}`);
  const output = next.join('\n').replace(/\n+$/g, '\n');
  fs.writeFileSync(filePath, output || `${key}=${normalized}\n`, 'utf8');
};

const getDevEnvFileCandidates = (appRoot) => [
  path.resolve(appRoot, '..', 'server', '.env.dev'),
  path.resolve(appRoot, '..', 'server', 'env', '.env.dev'),
];

const readCurrentDevLatestVersion = (appRoot) => {
  for (const envFile of getDevEnvFileCandidates(appRoot)) {
    const value = readEnvVarFromFile(envFile, APP_ANDROID_LATEST_VERSION_KEY);
    if (value) return value;
  }
  return '';
};

const persistDevLatestVersion = (appRoot, version) => {
  for (const envFile of getDevEnvFileCandidates(appRoot)) {
    upsertEnvVarInFile(envFile, APP_ANDROID_LATEST_VERSION_KEY, version);
  }
};

const getGradleBuildArgs = () => ['assembleRelease', '--no-daemon'];

const getBuildOptions = (args = process.argv.slice(2)) => ({
  clean: args.includes('--clean'),
});

const getAndroidBuildCachePaths = (appRoot) => [
  path.join(appRoot, 'android', 'app', 'build'),
  path.join(appRoot, 'android', 'app', '.cxx'),
];

const clearAndroidBuildCaches = (appRoot) => {
  for (const cachePath of getAndroidBuildCachePaths(appRoot)) {
    fs.rmSync(cachePath, { recursive: true, force: true });
  }
};

const run = (command, args, options) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...getSpawnOptions(),
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`);
  }
};

const copyReleaseApk = (appRoot) => {
  const releaseDir = path.join(appRoot, 'android', 'app', 'build', 'outputs', 'apk', 'release');
  const outputDir = path.join(appRoot, 'outputs');

  if (!fs.existsSync(releaseDir)) {
    throw new Error(`Release APK output directory was not found: ${releaseDir}`);
  }

  const apk = fs
    .readdirSync(releaseDir)
    .filter((file) => file.endsWith('.apk') && file.includes('release'))
    .map((file) => ({ file, mtime: fs.statSync(path.join(releaseDir, file)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];

  if (!apk) {
    throw new Error('Release APK was not found. Check the Android build output directory.');
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const source = path.join(releaseDir, apk.file);
  const target = path.join(outputDir, 'AppTemplate.apk');
  fs.copyFileSync(source, target);
  console.log(`APK copied to ${target}`);
};

const buildAndroid = (options = getBuildOptions()) => {
  const appRoot = path.resolve(__dirname, '..');
  const androidRoot = path.join(appRoot, 'android');
  const gradle = getGradleExecutable();
  const env = createBuildEnv();
  const appEnv = env.APP_ENV;
  const packageJsonPath = path.join(appRoot, 'package.json');
  const packageVersion = String(readJson(packageJsonPath).version || '').trim();
  const currentDevLatestVersion = appEnv === 'dev' ? readCurrentDevLatestVersion(appRoot) : '';
  const forcedVersion = String(env.APP_VERSION || '').trim();
  const buildVersion =
    forcedVersion ||
    resolveBuildVersion({
      appEnv,
      packageVersion,
      latestVersion: currentDevLatestVersion,
    });
  env.APP_VERSION = buildVersion;

  if (appEnv === 'dev') {
    persistDevLatestVersion(appRoot, buildVersion);
    if (forcedVersion) {
      console.log(`[build-android] dev version forced: ${buildVersion}`);
    } else {
      console.log(`[build-android] dev version resolved: ${currentDevLatestVersion || '(none)'} -> ${buildVersion}`);
    }
  } else {
    console.log(`[build-android] ${appEnv} version resolved: ${buildVersion}`);
  }

  run(gradle, ['--stop'], { cwd: androidRoot, env });
  if (options.clean) {
    clearAndroidBuildCaches(appRoot);
  }
  run(gradle, getGradleBuildArgs(), { cwd: androidRoot, env });
  copyReleaseApk(appRoot);
};

if (require.main === module) {
  try {
    buildAndroid();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = {
  buildAndroid,
  clearAndroidBuildCaches,
  copyReleaseApk,
  createBuildEnv,
  parseDevVersion,
  resolveBuildVersion,
  readEnvVarFromFile,
  upsertEnvVarInFile,
  readCurrentDevLatestVersion,
  persistDevLatestVersion,
  resolveAppEnv,
  getAndroidBuildCachePaths,
  getBuildOptions,
  getGradleBuildArgs,
  getGradleExecutable,
  getSpawnOptions,
};

