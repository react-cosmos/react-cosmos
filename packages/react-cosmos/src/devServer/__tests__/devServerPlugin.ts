// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestProcessUtils.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import {
  mockCosmosConfig,
  mockFile,
  resetFsMock,
} from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import retry from '@skidding/async-retry';
import 'isomorphic-fetch';
import * as http from 'node:http';
import path from 'node:path';
import { ServerMessage, SocketMessage } from 'react-cosmos-core';
import { DevServerPluginArgs } from '../../cosmosPlugin/types.js';
import { startDevServer } from '../startDevServer.js';

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

const devServerCleanup = jest.fn(() => Promise.resolve());
const testServerPlugin = {
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
  mockFile(testCosmosPlugin.server, { default: testServerPlugin });

  devServerCleanup.mockClear();
  testServerPlugin.config.mockClear();
  testServerPlugin.devServer.mockClear();
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
      command: 'dev',
      platform: 'web',
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
      platform: 'web',
      expressApp: expect.any(Function),
      httpServer: expect.any(http.Server),
      sendMessage: expect.any(Function),
    });

    await stopServer();

    expect(devServerCleanup).toBeCalled();
  });
});

it('calls dev server hook with send message API', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const client = new WebSocket(`ws://localhost:${port}`);

    const message: SocketMessage<ServerMessage> = {
      channel: 'server',
      message: {
        type: 'buildStart',
      },
    };

    const onMessage = jest.fn();
    client.addEventListener('open', () => {
      client.addEventListener('message', msg => onMessage(msg.data));

      const [args] = testServerPlugin.devServer.mock
        .calls[0] as DevServerPluginArgs[];
      args.sendMessage(message.message);
    });

    await retry(() =>
      expect(onMessage).toBeCalledWith(JSON.stringify(message))
    );
  });
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
