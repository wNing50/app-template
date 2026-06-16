const { spawnSync } = require('node:child_process');

const readConfig = (env = process.env) => ({
  localPort: env.CHANNEL_LOCAL_PORT || '15432',
  remoteHost: env.CHANNEL_REMOTE_HOST || '127.0.0.1',
  remotePort: env.CHANNEL_REMOTE_PORT || '5432',
  sshTarget: env.CHANNEL_SSH_TARGET || '',
});

const buildSshArgs = ({ localPort, remoteHost, remotePort, sshTarget }) => {
  if (!sshTarget) {
    throw new Error('Missing CHANNEL_SSH_TARGET, for example user@example.com');
  }
  return ['-L', `${localPort}:${remoteHost}:${remotePort}`, sshTarget];
};

const run = (env = process.env) => {
  const args = buildSshArgs(readConfig(env));
  const result = spawnSync('ssh', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return result.status ?? 1;
};

if (require.main === module) {
  try {
    process.exitCode = run();
  } catch (error) {
    console.error(error.message);
    console.error('Usage: set CHANNEL_SSH_TARGET=user@example.com && npm run server:channel');
    process.exitCode = 1;
  }
}

module.exports = { buildSshArgs, readConfig, run };
