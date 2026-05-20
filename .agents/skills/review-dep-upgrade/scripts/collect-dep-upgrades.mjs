#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const depSections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
];

const args = parseArgs(process.argv.slice(2));
const base = args.base || 'HEAD~1';
const head = args.head || 'worktree';
const useNetwork = !args['no-network'];
const outputJson = Boolean(args.json);
const npmTimeout = Number(args['npm-timeout'] || 15_000);

const packageFiles = getPackageFiles(base, head);
const upgrades = [];
const seen = new Set();
const packageTimeCache = new Map();

for (const file of packageFiles) {
  const before = readPackageAt(file, base);
  const after = readPackageAt(file, head);
  if (!before || !after) continue;

  for (const section of depSections) {
    const beforeDeps = before[section] || {};
    const afterDeps = after[section] || {};
    for (const name of Object.keys(afterDeps)) {
      if (!Object.hasOwn(beforeDeps, name)) continue;
      const previous = beforeDeps[name];
      const current = afterDeps[name];
      if (previous === current) continue;

      const key = `${name}\0${previous}\0${current}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const previousVersion = cleanVersion(previous);
      const currentVersion = cleanVersion(current);
      const previousDate = useNetwork
        ? getPublishDate(name, previousVersion, packageTimeCache)
        : null;
      const currentDate = useNetwork
        ? getPublishDate(name, currentVersion, packageTimeCache)
        : null;

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

if (outputJson) {
  console.log(JSON.stringify(upgrades, null, 2));
} else {
  printMarkdown(upgrades);
}

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function getPackageFiles(baseRef, headRef) {
  const files = new Set();
  for (const ref of [baseRef, headRef]) {
    for (const file of listPackageFiles(ref)) files.add(file);
  }
  return [...files].sort();
}

function listPackageFiles(ref) {
  if (ref === 'worktree') {
    return walkPackageFiles(process.cwd());
  }

  return execFileSync('git', ['ls-tree', '-r', '--name-only', ref], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(file => file.endsWith('package.json'))
    .filter(file => !file.includes('/node_modules/'));
}

function walkPackageFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkPackageFiles(fullPath));
    } else if (entry.name === 'package.json') {
      files.push(path.relative(process.cwd(), fullPath));
    }
  }
  return files;
}

function readPackageAt(file, ref) {
  try {
    const raw =
      ref === 'worktree'
        ? fs.readFileSync(file, 'utf8')
        : execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8' });
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
        timeout: npmTimeout,
      });
      cache.set(name, JSON.parse(raw));
    }
    return cache.get(name)[version] || null;
  } catch {
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

function printMarkdown(rows) {
  if (rows.length === 0) {
    console.log('No direct dependency upgrades found.');
    return;
  }

  for (const row of rows) {
    console.log(
      `### \`${row.dependency}\` — ${formatVersion(row.previousVersion, row.previousDate)} → ${formatVersion(row.currentVersion, row.currentDate)}`
    );
    console.log('');
    console.log(`- **Release gap:** ${row.releaseGap || 'unknown'}`);
    console.log('- **Notable changes:** TODO');
    console.log('- **Repo impact:** TODO');
    console.log('');
  }

  console.log('### Sources');
  console.log('');
  console.log('- TODO');
}

function formatVersion(version, date) {
  const formattedVersion = `\`${version}\``;
  return date ? `${formattedVersion} (${date.slice(0, 10)})` : formattedVersion;
}
