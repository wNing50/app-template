const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

test('root and server packages expose the SSH database channel script', () => {
  const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

  assert.equal(rootPkg.scripts['server:channel'], 'npm --prefix server run channel');
  assert.equal(serverPkg.scripts.channel, 'dotenv -e .env -- node ../scripts/server-channel.js');
});

test('server channel script builds a configurable SSH tunnel command', () => {
  const { buildSshArgs } = require('./server-channel');

  assert.deepEqual(
    buildSshArgs({
      localPort: '15432',
      remoteHost: 'db.internal',
      remotePort: '5432',
      sshTarget: 'deploy@example.com',
    }),
    ['-L', '15432:db.internal:5432', 'deploy@example.com'],
  );
});
