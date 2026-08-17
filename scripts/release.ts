// Publishes all packages to npm, replacing `lerna publish`.
//
// Modes:
// - Interactive (npm run release): pick a version bump, which is applied to
//   all workspace manifests, committed, tagged and pushed before publishing.
// - Canary (npm run release:canary): publishes <next-patch>-canary.<git-sha>
//   versions under the "canary" dist-tag without touching git. Used by the
//   release-canary workflow on every push to main.
//
// Pass --dry-run to skip all git writes and publish with `npm publish
// --dry-run`. Already-published versions are skipped, so a partially failed
// release can be resumed by re-running with the same version.
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { createInterface } from 'readline/promises';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { done, error, getBoolArg, packages } from './shared.js';

const { stdout, stderr } = process;

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const canary = getBoolArg('canary');
const dryRun = getBoolArg('dry-run');

(async () => {
  const currentVersion = (await readManifest('.')).version;

  let version: string;
  if (canary) {
    const sha = await runQuiet('git', ['rev-parse', '--short', 'HEAD']);
    const { major, minor, patch } = parseVersion(currentVersion);
    version = `${major}.${minor}.${patch + 1}-canary.${sha}`;
  } else {
    if (!dryRun) await assertReleasableGitState();
    version = await promptForVersion(currentVersion);
  }

  const prerelease = version.includes('-');
  const distTag = canary ? 'canary' : prerelease ? 'next' : 'latest';

  stdout.write(
    `Releasing ${chalk.bold(`v${version}`)} ` +
      `(dist-tag ${chalk.bold(distTag)})${dryRun ? ' — dry run' : ''}...\n`
  );

  // Prerelease versions get exact dependency ranges because caret ranges
  // don't match across prereleases (^8.0.0-beta.0 doesn't match 8.0.0-beta.1).
  const { files, originals } = await updateManifests(
    version,
    canary || prerelease
  );

  try {
    if (dryRun) {
      await runLoud('git', ['--no-pager', 'diff', '--', ...files]);
    } else if (!canary) {
      await runLoud('npm', ['install', '--package-lock-only']);
      await commitTagPush(version, [...files, 'package-lock.json']);
    }

    for (const pkgName of packages) {
      if (await isPublished(pkgName, version)) {
        stdout.write(`Skipping ${chalk.bold(pkgName)} (already published)\n`);
        continue;
      }
      const args = ['publish', '--workspace', pkgName, '--tag', distTag];
      if (dryRun) args.push('--dry-run');
      await runLoud('npm', args);
      stdout.write(done(`${chalk.bold(`${pkgName}@${version}`)}\n`));
    }

    stdout.write(done(`Released ${packages.length} packages.\n`));
  } finally {
    // Canary versions are never committed; dry runs shouldn't leave changes.
    // Restore the snapshotted contents instead of `git checkout` so any
    // pre-existing uncommitted manifest changes survive.
    if (canary || dryRun) {
      await Promise.all(
        [...originals].map(([file, content]) =>
          fs.writeFile(path.join(rootDir, file), content)
        )
      );
    }
  }
})().catch(err => {
  stderr.write(error(`${err instanceof Error ? err.message : err}\n`));
  process.exit(1);
});

function parseVersion(version: string) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) throw new Error(`Invalid version: ${version}`);
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease,
  };
}

function versionBumps(currentVersion: string): [string, string][] {
  const { major, minor, patch, prerelease } = parseVersion(currentVersion);
  if (prerelease) {
    // Mid-prerelease cycle: bump the prerelease number (beta.15 => beta.16)
    // or graduate to the stable version.
    const preMatch = prerelease.match(/^(.*?)(\d+)$/);
    const nextPre = preMatch
      ? `${preMatch[1]}${Number(preMatch[2]) + 1}`
      : `${prerelease}.0`;
    const stable = `${major}.${minor}.${patch}`;
    return [
      ['prerelease', `${stable}-${nextPre}`],
      ['stable', stable],
    ];
  }
  return [
    ['patch', `${major}.${minor}.${patch + 1}`],
    ['minor', `${major}.${minor + 1}.0`],
    ['major', `${major + 1}.0.0`],
  ];
}

async function assertReleasableGitState() {
  const branch = await runQuiet('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== 'main') {
    throw new Error(`Releases only allowed from main (on ${branch})`);
  }
  if (await runQuiet('git', ['status', '--porcelain'])) {
    throw new Error('Working tree isn’t clean');
  }
}

async function promptForVersion(currentVersion: string) {
  const { major } = parseVersion(currentVersion);
  const bumps = versionBumps(currentVersion);
  const customChoice = bumps.length + 1;

  stdout.write(`Current version: ${chalk.bold(currentVersion)}\n`);
  bumps.forEach(([type, version], i) => {
    stdout.write(`  ${i + 1}) ${type.padEnd(10)} ${version}\n`);
  });
  stdout.write(`  ${customChoice}) custom (e.g. ${major + 1}.0.0-beta.0)\n`);

  const rl = createInterface({ input: process.stdin, output: stdout });
  try {
    const choice = (await rl.question('Select release type: ')).trim();
    let version = bumps[Number(choice) - 1]?.[1];
    if (!version) {
      if (choice !== String(customChoice)) {
        throw new Error(`Invalid choice: ${choice}`);
      }
      version = (await rl.question('Custom version: ')).trim();
      parseVersion(version);
    }

    const confirm = await rl.question(
      `Release ${packages.length} packages as ${chalk.bold(`v${version}`)}? [y/N] `
    );
    if (!/^y(es)?$/i.test(confirm.trim())) {
      stdout.write('Aborted.\n');
      process.exit(0);
    }
    return version;
  } finally {
    rl.close();
  }
}

// Sets the new version in every workspace manifest (plus the root one, the
// version source of truth) and updates dependency ranges pointing at
// workspace packages. Returns the changed files along with their original
// contents so they can be restored.
async function updateManifests(version: string, exact: boolean) {
  const dirs = [
    '.',
    ...packages.map(p => `packages/${p}`),
    ...(await exampleDirs()),
  ];
  const manifests = await Promise.all(
    dirs.map(async dir => {
      const file = path.join(dir, 'package.json');
      const content = await fs.readFile(path.join(rootDir, file), 'utf8');
      return { dir, file, content, pkg: JSON.parse(content) };
    })
  );
  const workspaceNames = new Set(
    manifests.map(m => m.pkg.name).filter(Boolean)
  );
  const range = exact ? version : `^${version}`;

  const files: string[] = [];
  const originals = new Map<string, string>();
  for (const { file, content, pkg } of manifests) {
    pkg.version = version;
    for (const depType of [
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ]) {
      const deps = pkg[depType];
      for (const depName of Object.keys(deps ?? {})) {
        // Only rewrite ranges that track the workspace version, leaving open
        // ranges like `"react-cosmos": ">=7"` peer deps alone.
        if (
          workspaceNames.has(depName) &&
          /^\^?\d+\.\d+\.\d+/.test(deps[depName])
        ) {
          deps[depName] = range;
        }
      }
    }
    await fs.writeFile(
      path.join(rootDir, file),
      JSON.stringify(pkg, null, 2) + '\n'
    );
    files.push(file);
    originals.set(file, content);
  }
  return { files, originals };
}

async function commitTagPush(version: string, files: string[]) {
  const tag = `v${version}`;
  if (await runQuiet('git', ['status', '--porcelain'])) {
    await runLoud('git', ['add', ...files]);
    await runLoud('git', ['commit', '-m', `[release] ${tag}`]);
  }
  if (!(await runQuiet('git', ['tag', '-l', tag]))) {
    await runLoud('git', ['tag', '-a', tag, '-m', tag]);
  }
  await runLoud('git', ['push', '--follow-tags']);
}

async function isPublished(pkgName: string, version: string) {
  try {
    await runQuiet('npm', ['view', `${pkgName}@${version}`, 'version']);
    return true;
  } catch {
    return false;
  }
}

async function readManifest(dir: string) {
  const file = path.join(rootDir, dir, 'package.json');
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function exampleDirs() {
  const entries = await fs.readdir(path.join(rootDir, 'examples'), {
    withFileTypes: true,
  });
  return entries.filter(e => e.isDirectory()).map(e => `examples/${e.name}`);
}

function runQuiet(cmd: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: rootDir });
    let output = '';
    child.stdout.on('data', data => (output += data));
    child.stderr.on('data', data => (output += data));
    child.on('close', code => {
      if (code) {
        reject(new Error(`${cmd} ${args.join(' ')} failed:\n${output}`));
      } else {
        resolve(output.trim());
      }
    });
  });
}

function runLoud(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: rootDir, stdio: 'inherit' });
    child.on('close', code => {
      if (code) {
        reject(new Error(`${cmd} ${args.join(' ')} failed`));
      } else {
        resolve();
      }
    });
  });
}
