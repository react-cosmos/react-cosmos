// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig, mockFile } from '../../testHelpers/mockFs.js';
import '../../testHelpers/mockOsNetworkInterfaces.js';
import { mockCliArgs } from '../../testHelpers/mockYargs.js';

import http from 'node:http';
import 'isomorphic-fetch';
import path from 'node:path';
import { vi } from 'vitest';
import type {
  CosmosConfigPluginArgs,
  DevServerPluginArgs,
} from '../../cosmosPlugin/types.js';
import { getWebSocketUrl } from '../../shared/webSocketUrl.js';
import { createTestPortFinder } from '../../testHelpers/testPorts.js';
import { startDevServer } from '../startDevServer.js';

const findTestPort = createTestPortFinder(21000);

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};

const testServerPlugin = {
  name: 'testServerPlugin',
  config: vi.fn(({ config }: CosmosConfigPluginArgs) => config),
  devServer: vi.fn((_: DevServerPluginArgs) => {}),
};

let otherServer: http.Server;
let takenPort: number;
let consoleLog: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  // Another server takes the port before Cosmos starts
  otherServer = http.createServer((_, res) => res.end('Not Cosmos'));
  takenPort = await findTestPort();
  await new Promise<void>(resolve => otherServer.listen(takenPort, resolve));

  consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  testServerPlugin.config.mockClear();
  testServerPlugin.devServer.mockClear();

  await mockCliArgs({});
  await mockFile(testCosmosPlugin.server, { default: testServerPlugin });
  await mockCosmosPlugins([testCosmosPlugin]);
});

afterEach(async () => {
  consoleLog.mockRestore();
  await new Promise(resolve => otherServer.close(resolve));
});

it('moves to another port and shares it with plugins', async () => {
  await mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port: takenPort,
  });

  const stopServer = await startDevServer('web');
  try {
    // Config plugins run before the port is bound
    const [configArgs] = testServerPlugin.config.mock.calls[0];
    expect(configArgs.config.port).toBe(takenPort);

    const [{ config }] = testServerPlugin.devServer.mock.calls[0];
    expect(config.port).toBeGreaterThan(takenPort);
    expect(getWebSocketUrl(config)).toBe(`ws://192.168.1.10:${config.port}`);

    const res = await fetch(`http://localhost:${config.port}`);
    expect(await res.text()).toContain('<title>React Cosmos</title>');

    expect(consoleLog).toBeCalledWith(
      `[Cosmos] Port ${takenPort} already in use, trying next...`
    );
    expect(consoleLog).toBeCalledWith(
      `[Cosmos] See you at http://localhost:${config.port} or http://192.168.1.10:${config.port}`
    );
  } finally {
    await stopServer();
  }
});

it('fails when the port is taken and port retries are off', async () => {
  await mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port: takenPort,
    portRetries: 0,
  });

  await expect(startDevServer('web')).rejects.toThrow(
    `Port ${takenPort} is already in use`
  );
  expect(testServerPlugin.devServer).not.toBeCalled();

  // The other server is left alone
  const res = await fetch(`http://localhost:${takenPort}`);
  expect(await res.text()).toBe('Not Cosmos');
});
