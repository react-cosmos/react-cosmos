// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import {
  mockCosmosConfig,
  mockFile,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { vi } from 'vitest';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { viteWorkerId } from '../../testHelpers/viteUtils.js';
import { generateExport } from '../generateExport.js';

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};

const asyncMock = vi.fn();
const testServerPlugin = {
  name: 'testServerPlugin',

  config: vi.fn(async ({ config }) => {
    return {
      ...config,
      ignore: ['**/ignored.fixture.js'],
    };
  }),

  export: vi.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    asyncMock();
  }),
};

const port = 5000 + viteWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const exportPath = path.join(testFsPath, `export-${viteWorkerId()}`);

beforeEach(async () => {
  await mockCliArgs({});
  await mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port,
    exportPath,
  });
  await mockFile(testCosmosPlugin.server, { default: testServerPlugin });
  await mockCosmosPlugins([testCosmosPlugin]);

  asyncMock.mockClear();
  testServerPlugin.config.mockClear();
  testServerPlugin.export.mockClear();
});

afterEach(async () => {
  await unmockCliArgs();
  await resetFsMock();
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('calls config hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(testServerPlugin.config).toBeCalledWith({
      config: expect.objectContaining({ exportPath }),
      mode: 'export',
      platform: 'web',
    });
  });
});

it('calls export hook (with updated config)', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(testServerPlugin.export).toBeCalledWith({
      config: expect.objectContaining({
        exportPath,
        ignore: ['**/ignored.fixture.js'],
      }),
    });
    expect(asyncMock).toBeCalled();
  });
});

it('does not embed server-only plugins in playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    const html = await readExportFile('index.html');
    expect(html).toContain(`"pluginConfigs":[]`);
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
