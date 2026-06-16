const fs = require('fs');
const path = require('path');

const allowed = new Set(['major', 'minor', 'patch']);
const level = (process.argv[2] || '').trim();

if (!allowed.has(level)) {
  console.error('Usage: npm run version -- <major|minor|patch>');
  process.exit(1);
}

const packageJsonPath = path.resolve(__dirname, '../app/package.json');
const json = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const parts = String(json.version || '0.0.0')
  .split('.')
  .map((v) => Number(v));

if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n) || n < 0)) {
  console.error(`Invalid app version: ${json.version}`);
  process.exit(1);
}

let [major, minor, patch] = parts;
if (level === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (level === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const nextVersion = `${major}.${minor}.${patch}`;
json.version = nextVersion;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

console.log(`app/package.json version bumped: ${parts.join('.')} -> ${nextVersion}`);
