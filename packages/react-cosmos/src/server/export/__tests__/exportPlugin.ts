// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import { mockResolve } from '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import {
  mockCosmosConfig,
  mockFileUrl,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import 'isomorphic-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CosmosServerPlugin } from '../../cosmosPlugin/types.js';
import { generateExport } from '../generateExport.js';

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

const asyncMock = jest.fn();
const testServerPlugin: CosmosServerPlugin = {
  name: 'testServerPlugin',

  export: jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    asyncMock();
  }),
};

const exportPath = path.join(__dirname, `../test-export-${jestWorkerId()}`);

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { exportPath });
  mockFileUrl(testCosmosPlugin.server, testServerPlugin);
});

afterEach(async () => {
  unmockCliArgs();
  resetFsMock();
  await fs.rm(exportPath, { recursive: true, force: true });
});

it('calls export hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    // These files are mocked because they are only available after all
    // Cosmos packages are built, and tests should run with source code only.
    mockResolve(
      'react-cosmos-ui/dist/playground.bundle.js',
      require.resolve('../../testHelpers/mock.bundle.js.txt')
    );
    mockResolve(
      'react-cosmos-ui/dist/playground.bundle.js.map',
      require.resolve('../../testHelpers/mock.bundle.js.map.txt')
    );

    expectLog('[Cosmos] Export complete!');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`Export path: ${exportPath}`);

    await generateExport();

    expect(testServerPlugin.export).toBeCalled();
    expect(asyncMock).toBeCalled();

    // Index HTML
    const html = await readExportFile('index.html');

    expect(html).toContain('<title>React Cosmos</title>');
    expect(html).toContain('<script src="playground.bundle.js"></script>');

    // Doesn't include non-UI plugins in exports
    expect(html).toContain(`"pluginConfigs":[]`);
  });
});

async function readExportFile(filePath: string) {
  return fs.readFile(path.join(exportPath, filePath), 'utf8');
}
