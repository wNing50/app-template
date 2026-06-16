const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const {
  clearAndroidBuildCaches,
  createBuildEnv,
  getAndroidBuildCachePaths,
  getBuildOptions,
  getGradleBuildArgs,
  getGradleExecutable,
  getSpawnOptions,
  parseDevVersion,
  resolveBuildVersion,
  readEnvVarFromFile,
  upsertEnvVarInFile,
} = require('./build-android');

test('uses gradlew.bat on Windows and ./gradlew elsewhere', () => {
  assert.equal(getGradleExecutable('win32'), 'gradlew.bat');
  assert.equal(getGradleExecutable('darwin'), './gradlew');
  assert.equal(getGradleExecutable('linux'), './gradlew');
});

test('uses shell only on Windows so batch files can run', () => {
  assert.equal(getSpawnOptions('win32').shell, true);
  assert.equal(getSpawnOptions('linux').shell, false);
  assert.equal(getSpawnOptions('darwin').shell, false);
});

test('forces release build to cloud production env', () => {
  const env = createBuildEnv({ APP_ENV: 'local', NODE_ENV: 'development', EXPO_NO_DOTENV: undefined });
  assert.equal(env.APP_ENV, 'local');
  assert.equal(env.NODE_ENV, 'production');
  assert.equal(env.EXPO_NO_DOTENV, '1');
  assert.equal(env.APP_VERSION, '');
});

test('falls back to cloud env when APP_ENV is invalid', () => {
  const env = createBuildEnv({ APP_ENV: 'staging', NODE_ENV: 'development', EXPO_NO_DOTENV: undefined });
  assert.equal(env.APP_ENV, 'cloud');
  assert.equal(env.NODE_ENV, 'production');
  assert.equal(env.EXPO_NO_DOTENV, '1');
});

test('builds release without Gradle clean to avoid stale native clean tasks', () => {
  assert.deepEqual(getGradleBuildArgs(), ['assembleRelease', '--no-daemon']);
  assert.equal(getGradleBuildArgs().includes('clean'), false);
});

test('does not clear Android build caches by default', () => {
  assert.deepEqual(getBuildOptions([]), { clean: false });
});

test('clears Android build caches only when --clean is passed', () => {
  assert.deepEqual(getBuildOptions(['--clean']), { clean: true });
});

test('clears stale Android build caches before assembleRelease when requested', () => {
  const appRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'app-template-build-'));
  const cachePaths = getAndroidBuildCachePaths(appRoot);
  for (const cachePath of cachePaths) {
    fs.mkdirSync(cachePath, { recursive: true });
    fs.writeFileSync(path.join(cachePath, 'stale.txt'), 'stale');
  }

  clearAndroidBuildCaches(appRoot);

  for (const cachePath of cachePaths) {
    assert.equal(fs.existsSync(cachePath), false);
  }
  fs.rmSync(appRoot, { recursive: true, force: true });
});

test('parses semver and dev prerelease versions', () => {
  assert.deepEqual(parseDevVersion('0.0.3'), { base: '0.0.3', dev: null });
  assert.deepEqual(parseDevVersion('0.0.3-dev7'), { base: '0.0.3', dev: 7 });
  assert.equal(parseDevVersion('0.0.3-beta1'), null);
});

test('increments dev version when package base version is unchanged', () => {
  const next = resolveBuildVersion({
    appEnv: 'dev',
    packageVersion: '0.0.3',
    latestVersion: '0.0.3-dev4',
  });
  assert.equal(next, '0.0.3-dev5');
});

test('resets dev version to 1 when package base version changes', () => {
  const next = resolveBuildVersion({
    appEnv: 'dev',
    packageVersion: '0.0.4',
    latestVersion: '0.0.3-dev9',
  });
  assert.equal(next, '0.0.4-dev1');
});

test('uses base package version for non-dev builds', () => {
  const next = resolveBuildVersion({
    appEnv: 'cloud',
    packageVersion: '0.0.3',
    latestVersion: '0.0.3-dev9',
  });
  assert.equal(next, '0.0.3');
});

test('reads and updates env file keys', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-template-env-'));
  const envPath = path.join(dir, '.env.dev');
  fs.writeFileSync(envPath, 'A=1\nAPP_ANDROID_LATEST_VERSION=0.0.3-dev1\n', 'utf8');

  assert.equal(readEnvVarFromFile(envPath, 'APP_ANDROID_LATEST_VERSION'), '0.0.3-dev1');
  upsertEnvVarInFile(envPath, 'APP_ANDROID_LATEST_VERSION', '0.0.3-dev2');
  assert.equal(readEnvVarFromFile(envPath, 'APP_ANDROID_LATEST_VERSION'), '0.0.3-dev2');

  upsertEnvVarInFile(envPath, 'NEW_KEY', 'hello');
  assert.equal(readEnvVarFromFile(envPath, 'NEW_KEY'), 'hello');
  fs.rmSync(dir, { recursive: true, force: true });
});
