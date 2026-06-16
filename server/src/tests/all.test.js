const test = require('node:test');
const assert = require('node:assert/strict');
const { createApp, normalizeBasePath } = require('../app');

test('normalizeBasePath formats optional API prefixes', () => {
  assert.equal(normalizeBasePath('api'), '/api');
  assert.equal(normalizeBasePath('/api/'), '/api');
  assert.equal(normalizeBasePath(''), '');
});

test('createApp returns an express app', () => {
  const app = createApp();
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.listen, 'function');
});
