const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));

const requiredFiles = [
  'manifest.json',
  'background.js',
  'popup.html',
  'popup.css',
  'popup.js',
  'languages.js',
  'permission.html',
  'permission.js',
  '440x280_Tradutor.png',
  'LICENSE'
];

test('required files exist', () => {
  for (const relativePath of requiredFiles) {
    assert.ok(fs.existsSync(path.join(root, relativePath)), `Arquivo ausente: ${relativePath}`);
  }
});

test('manifest stays on the expected MV3 surface', () => {
  const manifest = readJson('manifest.json');

  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.action.default_popup, 'popup.html');
  assert.equal(manifest.background.service_worker, 'background.js');
  assert.deepEqual(new Set(manifest.permissions), new Set(['contextMenus', 'storage']));
  assert.deepEqual(manifest.host_permissions, ['https://api.mymemory.translated.net/*']);
});

test('popup contract exposes the key controls', () => {
  const popupHtml = readText('popup.html');

  for (const id of [
    'sourceLang',
    'targetLang',
    'sourceText',
    'targetText',
    'translateBtn',
    'swapLanguages',
    'micBtn',
    'speakBtn',
    'voiceSelect',
    'historyList',
    'clearHistoryBtn',
    'supportBtn'
  ]) {
    assert.match(popupHtml, new RegExp(`id="${id}"`));
  }
});

test('background menu opens the popup with truncation metadata', () => {
  const backgroundJs = readText('background.js');

  assert.match(backgroundJs, /translate-selection/);
  assert.match(backgroundJs, /slice\(0, 5000\)/);
  assert.match(backgroundJs, /truncated=true/);
});

test('popup keeps the storage and autodetect safeguards in place', () => {
  const popupJs = readText('popup.js');

  assert.match(popupJs, /AbortController/);
  assert.match(popupJs, /isAutodetectValue/);
  assert.match(popupJs, /QuotaExceededError/);
  assert.match(popupJs, /clearStoredCache/);
});
