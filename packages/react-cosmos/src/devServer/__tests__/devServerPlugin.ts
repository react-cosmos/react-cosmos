// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig, mockFile } from '../../testHelpers/mockFs.js';
import { mockCliArgs } from '../../testHelpers/mockYargs.js';

import retry from '@skidding/async-retry';
import 'isomorphic-fetch';
import * as http from 'node:http';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { ServerMessage, SocketMessage } from 'react-cosmos-core';
import { DevServerPluginArgs } from '../../cosmosPlugin/types.js';
import { jestWorkerId } from '../../testHelpers/jestProcessUtils.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
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
    await setTimeout(50);
    return async () => {
      await setTimeout(50);
      devServerCleanup();
    };
  }),
};

const port = 5000 + jestWorkerId();

let _stopServer: (() => Promise<unknown>) | undefined;

beforeAll(async () => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port });
  mockFile(testCosmosPlugin.server, { default: testServerPlugin });

  await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] Found 1 plugin: Test Cosmos plugin');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);
    _stopServer = await startDevServer('web');
  });
});

it('calls config hook', async () => {
  expect(testServerPlugin.config).toBeCalledWith({
    cosmosConfig: expect.objectContaining({ port }),
    command: 'dev',
    platform: 'web',
  });
});

it('calls dev server hook (with updated config)', async () => {
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
});

it('calls dev server hook with send message API', async () => {
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

  await retry(() => expect(onMessage).toBeCalledWith(JSON.stringify(message)));
});

it('embeds plugin in playground HTML', async () => {
  const res = await fetch(`http://localhost:${port}`);
  expect(res.status).toBe(200);

  const html = await res.text();
  expect(html).toContain(JSON.stringify([testCosmosPlugin]));
});

it('calls dev server cleanup hook', async () => {
  await _stopServer!();
  expect(devServerCleanup).toBeCalled();
});
