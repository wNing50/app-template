const { spawnSync } = require('node:child_process');
const path = require('node:path');

const serverDir = path.resolve(__dirname, '..', 'server');

const targets = {
  prod: {
    project: process.env.DOCKER_PROJECT_PROD || 'app-template-server',
    scale: '2',
    env: {},
  },
  dev: {
    project: process.env.DOCKER_PROJECT_DEV || 'app-template-server-dev',
    scale: '1',
    env: {
      SERVER_ENV_FILE: './.env.dev',
      SERVER_PUBLIC_PORT: '8889',
      SERVER_BACKEND_SUBNET: '172.21.0.0/24',
    },
  },
};

const composePrefix = (target) => [
  'compose',
  '-p',
  target.project,
  '-f',
  'docker-compose.server-multi.yml',
];

const buildDockerCommand = (action, targetName = 'prod') => {
  const target = targets[targetName];
  if (!target) throw new Error(`Unknown docker target: ${targetName}`);

  if (action === 'down') {
    return {
      cwd: serverDir,
      env: target.env,
      args: [...composePrefix(target), 'down', '--remove-orphans'],
    };
  }

  if (action === 'up') {
    return {
      cwd: serverDir,
      env: target.env,
      args: [...composePrefix(target), 'up', '-d', '--build', '--scale', `server=${target.scale}`],
    };
  }

  if (action === 'logs') {
    return {
      cwd: serverDir,
      env: target.env,
      args: [...composePrefix(target), 'logs', '--tail=200', '--follow'],
    };
  }

  throw new Error(`Unknown docker action: ${action}`);
};

const runDockerCommand = (action, targetName) => {
  const command = buildDockerCommand(action, targetName);
  const result = spawnSync('docker', command.args, {
    cwd: command.cwd,
    env: { ...process.env, ...command.env },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return result.status ?? 1;
};

const run = (argv) => {
  const [action, targetName = 'prod'] = argv;
  if (!action || action === 'help' || action === '--help') {
    console.log('Usage: node scripts/docker-server.js <up|down|redeploy|logs> [prod|dev]');
    return 0;
  }

  if (action === 'redeploy') {
    const downStatus = runDockerCommand('down', targetName);
    if (downStatus !== 0) return downStatus;
    return runDockerCommand('up', targetName);
  }

  return runDockerCommand(action, targetName);
};

if (require.main === module) {
  process.exitCode = run(process.argv.slice(2));
}

module.exports = {
  buildDockerCommand,
  run,
};
