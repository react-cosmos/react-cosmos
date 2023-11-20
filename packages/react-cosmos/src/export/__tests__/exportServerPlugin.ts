// Module mocks need to be imported before the mocked module is imported,
// even if the module is not used in the test. Otherwise the mocks won't apply.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import {
  mockCosmosConfig,
  mockFile,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import fs from 'node:fs/promises';
import path from 'node:path';
import { jestWorkerId } from '../../testHelpers/jestProcessUtils.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { generateExport } from '../generateExport.js';

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

const asyncMock = jest.fn();
const testServerPlugin = {
  name: 'testServerPlugin',

  config: jest.fn(async ({ cosmosConfig }) => {
    return {
      ...cosmosConfig,
      ignore: ['**/ignored.fixture.js'],
    };
  }),

  export: jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    asyncMock();
  }),
};

const port = 5000 + jestWorkerId();

const testFsPath = path.join(__dirname, '../__testFs__');
const exportPath = path.join(testFsPath, `export-${jestWorkerId()}`);

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port, exportPath });
  mockFile(testCosmosPlugin.server, { default: testServerPlugin });

  asyncMock.mockClear();
  testServerPlugin.config.mockClear();
  testServerPlugin.export.mockClear();
});

afterEach(async () => {
  unmockCliArgs();
  resetFsMock();
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('calls config hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(testServerPlugin.config).toBeCalledWith({
      cosmosConfig: expect.objectContaining({ exportPath }),
      command: 'export',
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
      cosmosConfig: expect.objectContaining({
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
