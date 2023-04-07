// Import mocks first
import { CosmosPluginConfig } from 'react-cosmos-core';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';

import * as http from 'node:http';
import path from 'node:path';
import { CosmosServerPlugin } from '../../cosmosPlugin/types.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import {
  mockCosmosConfig,
  mockFile,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';
import { startDevServer } from '../startDevServer.js';

const testCosmosPlugin: CosmosPluginConfig = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};

jest.mock('../../cosmosPlugin/pluginConfigs.js', () => {
  return {
    getPluginConfigs: jest.fn(() => [testCosmosPlugin]),
  };
});

const devServerCleanup = jest.fn(() => Promise.resolve());

const testServerPlugin: CosmosServerPlugin = {
  name: 'testServerPlugin',

  devServer: jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    devServerCleanup();
  }),
};

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port: 5001 });
  mockFile(
    path.join(__dirname, 'mock-cosmos-plugin/server.js'),
    testServerPlugin
  );
});

afterEach(() => {
  unmockCliArgs();
  resetFsMock();
});

it('calls dev server hook', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog('[Cosmos] See you at http://localhost:5001');

    const stopServer = await startDevServer('web');

    expect(testServerPlugin.devServer).toBeCalledWith({
      cosmosConfig: expect.objectContaining({ port: 5001 }),
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
    expectLog('[Cosmos] See you at http://localhost:5001');

    const stopServer = await startDevServer('web');

    expect(devServerCleanup).toBeCalled();

    await stopServer();
  });
});

// TODO
// - calls async config hook
// - embeds plugins in playground HTML
