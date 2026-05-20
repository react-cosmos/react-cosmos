#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const NPM_TIMEOUT = 15_000;

const depSections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const args = parseArgs(process.argv.slice(2));
const base = args.base || 'HEAD~1';
const head = args.head || 'worktree';

const packageFiles = getPackageFiles(base, head);
const internalNames = collectInternalNames(packageFiles, head);
const upgrades = [];
const seen = new Set();
const packageTimeCache = new Map();
const failedLookups = new Set();

for (const file of packageFiles) {
  const before = readPackageAt(file, base);
  const after = readPackageAt(file, head);
  if (!before || !after) continue;

  for (const section of depSections) {
    const beforeDeps = before[section] || {};
    const afterDeps = after[section] || {};
    for (const name of Object.keys(afterDeps)) {
      if (internalNames.has(name)) continue;
      if (!Object.hasOwn(beforeDeps, name)) continue;

      const previousVersion = cleanVersion(beforeDeps[name]);
      const currentVersion = cleanVersion(afterDeps[name]);
      if (previousVersion === currentVersion) continue;

      const key = `${name}\0${previousVersion}\0${currentVersion}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const previousDate = getPublishDate(
        name,
        previousVersion,
        packageTimeCache
      );
      const currentDate = getPublishDate(
        name,
        currentVersion,
        packageTimeCache
      );

      upgrades.push({
        dependency: name,
        previousVersion,
        previousDate,
        currentVersion,
        currentDate,
        releaseGap: dateDiff(previousDate, currentDate),
        releaseGapMs:
          previousDate && currentDate
            ? new Date(currentDate) - new Date(previousDate)
            : null,
      });
    }
  }
}

upgrades.sort(
  (a, b) => (b.releaseGapMs ?? -Infinity) - (a.releaseGapMs ?? -Infinity)
);

for (const upgrade of upgrades) {
  if (failedLookups.has(upgrade.dependency)) {
    upgrade.lookupError = true;
  }
}

console.log(JSON.stringify(upgrades, null, 2));

if (failedLookups.size > 0) {
  process.exitCode = 1;
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      console.error(`--${key} requires a value`);
      process.exit(1);
    }
    parsed[key] = next;
    i += 1;
  }
  return parsed;
}

function collectInternalNames(files, ref) {
  const names = new Set();
  for (const file of files) {
    const pkg = readPackageAt(file, ref);
    if (pkg?.name) names.add(pkg.name);
  }
  return names;
}

function getPackageFiles(baseRef, headRef) {
  const files = new Set();
  for (const ref of [baseRef, headRef]) {
    for (const file of listPackageFiles(ref)) files.add(file);
  }
  return [...files].sort();
}

function listPackageFiles(ref) {
  const gitArgs =
    ref === 'worktree' ? ['ls-files'] : ['ls-tree', '-r', '--name-only', ref];

  return execFileSync('git', gitArgs, { encoding: 'utf8' })
    .split('\n')
    .filter(file => file.endsWith('package.json'))
    .filter(file => !file.includes('/node_modules/'));
}

function readPackageAt(file, ref) {
  try {
    const raw =
      ref === 'worktree'
        ? fs.readFileSync(file, 'utf8')
        : execFileSync('git', ['show', `${ref}:${file}`], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
          });
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function cleanVersion(version) {
  return version.replace(/^[~^]/, '');
}

function getPublishDate(name, version, cache) {
  if (!version || version === '*' || version.startsWith('workspace:'))
    return null;

  try {
    if (!cache.has(name)) {
      const raw = execFileSync('npm', ['view', name, 'time', '--json'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: NPM_TIMEOUT,
      });
      cache.set(name, JSON.parse(raw));
    }
    return cache.get(name)[version] || null;
  } catch (err) {
    if (!failedLookups.has(name)) {
      failedLookups.add(name);
      console.error(`npm view ${name} failed: ${err.message.split('\n')[0]}`);
    }
    cache.set(name, {});
    return null;
  }
}

function dateDiff(previousDate, currentDate) {
  if (!previousDate || !currentDate) return '';
  let ms = new Date(currentDate) - new Date(previousDate);
  const sign = ms < 0 ? '-' : '';
  ms = Math.abs(ms);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days === 0 && hours === 0) return `${sign}<1h`;
  if (days === 0) return `${sign}${hours}h`;
  if (days < 60) return `${sign}${days}d ${hours}h`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    const remDays = days % 30;
    return `${sign}${months}mo ${remDays}d`;
  }
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${sign}${years}y ${months}mo` : `${sign}${years}y`;
}
