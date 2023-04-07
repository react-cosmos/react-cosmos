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

  devServer: jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return () => devServerCleanup();
  }),
};

const port = 5000 + jestWorkerId();

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port });
  mockFileUrl(testCosmosPlugin.server, testServerPlugin);
});

afterEach(() => {
  unmockCliArgs();
  resetFsMock();
});

it('calls dev server hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    expect(testServerPlugin.devServer).toBeCalledWith({
      cosmosConfig: expect.objectContaining({ port }),
      platformType: 'web',
      expressApp: expect.any(Function),
      httpServer: expect.any(http.Server),
      sendMessage: expect.any(Function),
    });

    await stopServer();
  });
});

it('calls async dev server cleanup hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');
    await stopServer();

    expect(devServerCleanup).toBeCalled();
  });
});

it('embeds plugins in playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain(JSON.stringify([testCosmosPlugin]));

    await stopServer();
  });
});

// TODO
// - calls async config hook
