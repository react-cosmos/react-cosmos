// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import 'isomorphic-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import { startDevServer } from '../startDevServer.js';

const port = 5000 + jestWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const pluginPath = path.join(testFsPath, `plugin-${jestWorkerId()}`);

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: pluginPath,
  ui: path.join(pluginPath, 'ui.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

let _stopServer: (() => Promise<unknown>) | undefined;

async function stopServer() {
  if (_stopServer) {
    await _stopServer();
    _stopServer = undefined;
  }
}

beforeEach(async () => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', {
    rootDir: testFsPath,
    port,
  });

  await fs.mkdir(testCosmosPlugin.rootDir, { recursive: true });
  await fs.writeFile(testCosmosPlugin.ui, 'export {}', 'utf8');
});

afterEach(async () => {
  await stopServer();
  unmockCliArgs();
  resetFsMock();
  await fs.rm(pluginPath, { recursive: true, force: true });
});

it('embeds plugin in playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain(JSON.stringify([testCosmosPlugin]));
  });
});

it('serves plugin JS files', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    // Windows paths don't start with a slash (e.g. C:\foo\bar.js)
    const uiPath = testCosmosPlugin.ui.startsWith('/')
      ? testCosmosPlugin.ui
      : `/${testCosmosPlugin.ui}`;
    const res = await fetch(`http://localhost:${port}/_plugin${uiPath}`);
    expect(res.status).toBe(200);

    const uiJs = await res.text();
    expect(uiJs).toBe('export {}');
  });
});
