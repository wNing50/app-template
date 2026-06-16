const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = (filePath) => fs.readFileSync(filePath, 'utf8');

test('CI workflow covers all template packages and checks', () => {
  const workflow = read('.github/workflows/tests.yml');

  assert.match(workflow, /npm i --prefix admin/);
  assert.match(workflow, /npm i --prefix web/);
  assert.match(workflow, /npm run test:scripts/);
  assert.match(workflow, /npm --prefix admin run test/);
  assert.match(workflow, /npm --prefix admin run build/);
  assert.match(workflow, /npm --prefix web run build/);
});

test('template tracks lockfiles for reproducible installs', () => {
  const gitignore = read('.gitignore');

  assert.doesNotMatch(gitignore, /^package-lock\.json$/m);
});

test('environment templates do not contain source project secrets or domains', () => {
  const envFiles = [
    'app/env/.env.local',
    'app/env/.env.dev',
    'app/env/.env.cloud',
    'web/.env.dev',
    'web/.env.cloud',
  ];

  for (const envFile of envFiles) {
    const text = read(path.resolve(envFile));
    const sourceProjectPattern = new RegExp(
      [['rem', 'iniscence'].join(''), ['nick', 'wu'].join(''), '10\\.43\\.252', 'DqjAZ', 'vJh7'].join('|'),
      'i',
    );
    assert.doesNotMatch(text, sourceProjectPattern, envFile);
  }
});
