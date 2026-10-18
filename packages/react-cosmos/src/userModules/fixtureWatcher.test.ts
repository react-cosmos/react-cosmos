import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import type { FSWatcher } from 'chokidar';
import { vi } from 'vitest';
import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { startFixtureWatcher } from './fixtureWatcher.js';

const SETTLE_MS = 300;
const WAIT_OPTIONS = { timeout: 5000 };

let rootDir: string;
let watcher: FSWatcher;
const callback = vi.fn();

beforeEach(async () => {
  rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cosmos-watcher-'));
  await fs.mkdir(path.join(rootDir, 'src'));
  await fs.mkdir(path.join(rootDir, 'node_modules/pkg'), { recursive: true });
  await fs.mkdir(path.join(rootDir, '.cache'));
  await fs.writeFile(path.join(rootDir, 'src/Existing.fixture.tsx'), '');
  // File system events for the setup above can arrive after the watcher is
  // ready (seen with FSEvents on macOS), so let them settle on both sides.
  await wait(SETTLE_MS);
  watcher = await startFixtureWatcher(
    createCosmosConfig(rootDir),
    'all',
    callback
  );
  await wait(SETTLE_MS);
  callback.mockClear();
});

afterEach(async () => {
  await watcher.close();
  await fs.rm(rootDir, { recursive: true, force: true });
});

function writeFile(relPath: string) {
  return fs.writeFile(path.join(rootDir, relPath), '');
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function expectCallback() {
  await vi.waitFor(() => expect(callback).toHaveBeenCalled(), WAIT_OPTIONS);
}

async function expectNoCallback() {
  await wait(1000);
  expect(callback).not.toHaveBeenCalled();
}

it('calls back when a fixture file is added', async () => {
  await writeFile('src/New.fixture.tsx');
  await expectCallback();
});

it('calls back when a file is added to a fixtures dir', async () => {
  await fs.mkdir(path.join(rootDir, 'src/__fixtures__'));
  await writeFile('src/__fixtures__/New.tsx');
  await expectCallback();
});

it('calls back when a decorator file is added', async () => {
  await writeFile('src/cosmos.decorator.tsx');
  await expectCallback();
});

it('calls back when a fixture file is removed', async () => {
  await fs.rm(path.join(rootDir, 'src/Existing.fixture.tsx'));
  await expectCallback();
});

it('ignores files that are neither fixtures nor decorators', async () => {
  await writeFile('src/helper.ts');
  await expectNoCallback();
});

it('ignores fixture files in ignored paths', async () => {
  await writeFile('node_modules/pkg/New.fixture.tsx');
  await expectNoCallback();
});

it('ignores fixture files in dot dirs', async () => {
  await writeFile('.cache/New.fixture.tsx');
  await expectNoCallback();
});
