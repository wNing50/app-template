const assert = require('node:assert/strict');
const test = require('node:test');

const { buildDockerCommand } = require('./docker-server');

test('builds production compose up command with two server instances', () => {
  const command = buildDockerCommand('up', 'prod');

  assert.equal(command.cwd.endsWith('server'), true);
  assert.deepEqual(command.env, {});
  assert.deepEqual(command.args, [
    'compose',
    '-p',
    'app-template-server',
    '-f',
    'docker-compose.server-multi.yml',
    'up',
    '-d',
    '--build',
    '--scale',
    'server=2',
  ]);
});

test('builds dev compose up command with dev env and one server instance', () => {
  const command = buildDockerCommand('up', 'dev');

  assert.deepEqual(command.env, {
    SERVER_ENV_FILE: './.env.dev',
    SERVER_PUBLIC_PORT: '8889',
    SERVER_BACKEND_SUBNET: '172.21.0.0/24',
  });
  assert.deepEqual(command.args.slice(0, 5), [
    'compose',
    '-p',
    'app-template-server-dev',
    '-f',
    'docker-compose.server-multi.yml',
  ]);
  assert.deepEqual(command.args.slice(-2), ['--scale', 'server=1']);
});
