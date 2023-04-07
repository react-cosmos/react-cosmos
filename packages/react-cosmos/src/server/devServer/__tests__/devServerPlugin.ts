// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import {
  mockCosmosConfig,
  mockFileUrl,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import 'isomorphic-fetch';
import * as http from 'node:http';
import path from 'node:path';
import { CosmosServerPlugin } from '../../cosmosPlugin/types.js';
import { startDevServer } from '../startDevServer.js';

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

const devServerCleanup = jest.fn(() => Promise.resolve());
const testServerPlugin: CosmosServerPlugin = {
  name: 'testServerPlugin',

  config: jest.fn(async ({ cosmosConfig }) => {
    return {
      ...cosmosConfig,
      ignore: ['**/ignored.fixture.js'],
    };
  }),

  devServer: jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return () => devServerCleanup();
  }),
};

const port = 5000 + jestWorkerId();

let _stopServer: (() => Promise<unknown>) | undefined;

async function stopServer() {
  if (_stopServer) {
    await _stopServer();
    _stopServer = undefined;
  }
}

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port });
  mockFileUrl(testCosmosPlugin.server, testServerPlugin);
});

afterEach(async () => {
  await stopServer();
  unmockCliArgs();
  resetFsMock();
});

it('calls config hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    expect(testServerPlugin.config).toBeCalledWith({
      cosmosConfig: expect.objectContaining({ port }),
      platformType: 'web',
    });
  });
});

it('calls dev server hook (with updated config)', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    expect(testServerPlugin.devServer).toBeCalledWith({
      cosmosConfig: expect.objectContaining({
        port,
        ignore: ['**/ignored.fixture.js'],
      }),
      platformType: 'web',
      expressApp: expect.any(Function),
      httpServer: expect.any(http.Server),
      sendMessage: expect.any(Function),
    });
  });
});

it('calls async dev server cleanup hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');
    await stopServer();

    expect(devServerCleanup).toBeCalled();
  });
});

it('embeds plugins in playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain(JSON.stringify([testCosmosPlugin]));
  });
});
