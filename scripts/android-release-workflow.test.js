const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const read = (path) => fs.readFileSync(path, 'utf8');

test('dev release keeps OSS APK upload optional and disabled by default', () => {
  const workflow = read('.github/workflows/android-release-dev.yml');

  assert.match(workflow, /upload_apk:\s*\n\s*description: 'Upload dev APK to OSS'/);
  assert.match(workflow, /upload_apk:[\s\S]*?default: false/);
  assert.match(workflow, /name: Setup ossutil[\s\S]*?if: \$\{\{ !inputs\.skip_build && inputs\.upload_apk \}\}/);
  assert.match(workflow, /name: Upload APK to OSS \(dev prefix\)[\s\S]*?if: \$\{\{ !inputs\.skip_build && inputs\.upload_apk \}\}/);
  assert.match(workflow, /path: app\/outputs\/AppTemplate\.apk/);
});

test('production release uses template deployment variables and artifact names', () => {
  const workflow = read('.github/workflows/android-release.yml');

  assert.match(workflow, /permissions:\s*\n\s*contents: write/);
  assert.match(workflow, /REMOTE_APP_DIR: \$\{\{ vars\.REMOTE_APP_DIR \|\| '\/opt\/app-template' \}\}/);
  assert.match(workflow, /secrets\.DEPLOY_HOST/);
  assert.match(workflow, /RELEASE_OSS_PUBLIC_BASE_URL/);
  assert.match(workflow, /path: app\/outputs\/AppTemplate\.apk/);
  assert.doesNotMatch(workflow, /Reminiscence/);
  assert.doesNotMatch(workflow, /ALI_/);
});
