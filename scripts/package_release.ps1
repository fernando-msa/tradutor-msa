param(
  [switch]$CleanDist
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $root 'manifest.json'
$distPath = Join-Path $root 'dist'

if (-not (Test-Path $manifestPath)) {
  throw "manifest.json nao encontrado em $root"
}

$manifest = Get-Content -Raw -Path $manifestPath | ConvertFrom-Json
$version = $manifest.version
if (-not $version) {
  throw 'Versao nao encontrada no manifest.json'
}

if (-not $PSBoundParameters.ContainsKey('CleanDist')) {
  $CleanDist = $true
}

if ($CleanDist) {
  if (Test-Path $distPath) {
    Get-ChildItem -Path $distPath -Force | Remove-Item -Recurse -Force
  }
} elseif (-not (Test-Path $distPath)) {
  New-Item -ItemType Directory -Path $distPath | Out-Null
}

if (-not (Test-Path $distPath)) {
  New-Item -ItemType Directory -Path $distPath | Out-Null
}

$requiredFiles = @(
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
)

foreach ($file in $requiredFiles) {
  $candidate = Join-Path $root $file
  if (-not (Test-Path $candidate)) {
    throw "Arquivo obrigatorio ausente: $file"
  }
}

$optionalDirs = @('assets')
$tempPath = Join-Path $distPath '_release_tmp'
if (Test-Path $tempPath) {
  Remove-Item -Recurse -Force $tempPath
}
New-Item -ItemType Directory -Path $tempPath | Out-Null

foreach ($file in $requiredFiles) {
  Copy-Item -Path (Join-Path $root $file) -Destination (Join-Path $tempPath $file)
}

foreach ($dir in $optionalDirs) {
  $src = Join-Path $root $dir
  if (Test-Path $src) {
    Copy-Item -Path $src -Destination (Join-Path $tempPath $dir) -Recurse
  }
}

$edgeZip = Join-Path $distPath "tradutor-msa-v$version-edge.zip"
$firefoxZip = Join-Path $distPath "tradutor-msa-v$version-firefox.zip"

if (Test-Path $edgeZip) { Remove-Item -Force $edgeZip }
if (Test-Path $firefoxZip) { Remove-Item -Force $firefoxZip }

Compress-Archive -Path (Join-Path $tempPath '*') -DestinationPath $edgeZip -CompressionLevel Optimal
Compress-Archive -Path (Join-Path $tempPath '*') -DestinationPath $firefoxZip -CompressionLevel Optimal

Remove-Item -Recurse -Force $tempPath

Write-Host "Pacotes gerados com sucesso:"
Write-Host "- $edgeZip"
Write-Host "- $firefoxZip"
