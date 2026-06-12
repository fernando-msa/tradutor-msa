import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsFilesToCheck = [
  'background.js',
  'popup.js',
  'permission.js',
  'languages.js',
  path.join('tests', 'extension-contract.test.js')
];

const textFilesToCheck = [path.join('scripts', 'package_release.ps1')];

const bannedPatterns = [
  {
    pattern: /innerHTML\s*=/,
    message: 'Use textContent/createElement em vez de innerHTML.'
  },
  {
    pattern: /\[switch\]\$[A-Za-z_][A-Za-z0-9_]*\s*=\s*\$true/,
    message: 'Evite valor padrão em switch parameters do PowerShell.'
  }
];

const requiredReleaseFiles = [
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

let failed = false;

for (const relativePath of jsFilesToCheck) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(existsSync(absolutePath), `Arquivo ausente: ${relativePath}`);

  const syntaxResult = await runNodeSyntaxCheck(absolutePath);
  if (syntaxResult.status !== 0) {
    failed = true;
    process.stderr.write(syntaxResult.stderr || syntaxResult.stdout || `Falha ao validar ${relativePath}\n`);
  }

  const content = readFileSync(absolutePath, 'utf8');
  for (const rule of bannedPatterns) {
    if (rule.pattern.test(content)) {
      failed = true;
      process.stderr.write(`${relativePath}: ${rule.message}\n`);
    }
  }
}

for (const relativePath of textFilesToCheck) {
  const absolutePath = path.join(root, relativePath);
  assert.ok(existsSync(absolutePath), `Arquivo ausente: ${relativePath}`);
}

const packageScript = readFileSync(path.join(root, 'scripts', 'package_release.ps1'), 'utf8');
const releaseWorkflow = readFileSync(path.join(root, '.github', 'workflows', 'release.yml'), 'utf8');

if (!containsAllExpectedFiles(packageScript, requiredReleaseFiles, 'scripts/package_release.ps1')) {
  failed = true;
}

if (!containsAllExpectedFiles(releaseWorkflow, requiredReleaseFiles, '.github/workflows/release.yml')) {
  failed = true;
}

if ((releaseWorkflow.match(/LICENSE/g) || []).length !== 1) {
  failed = true;
  process.stderr.write('.github/workflows/release.yml: LICENSE deve aparecer exatamente uma vez no comando de zip.\n');
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('Lint básico concluído com sucesso.');
}

function containsAllExpectedFiles(sourceText, expectedFiles, label) {
  const missing = expectedFiles.filter((fileName) => !sourceText.includes(fileName));

  if (missing.length > 0) {
    process.stderr.write(`${label}: faltam os arquivos esperados: ${missing.join(', ')}\n`);
    return false;
  }

  return true;
}

async function runNodeSyntaxCheck(absolutePath) {
  return new Promise((resolve) => {
    const result = spawnSync(process.execPath, ['--check', absolutePath], { encoding: 'utf8' });
    resolve(result);
  });
}