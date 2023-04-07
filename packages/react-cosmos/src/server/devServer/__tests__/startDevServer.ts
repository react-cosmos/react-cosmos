// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import {
  mockResolve,
  resetResolveMock,
} from '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import retry from '@skidding/async-retry';
import 'isomorphic-fetch';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ServerMessage, SocketMessage } from 'react-cosmos-core';
import { startDevServer } from '../startDevServer.js';

mockCosmosPlugins([]);

const port = 5000 + jestWorkerId();

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port });
});

afterEach(() => {
  unmockCliArgs();
  resetFsMock();
  resetResolveMock();
});

it('serves playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain('<title>React Cosmos</title>');
    expect(body).toContain('<script src="playground.bundle.js"></script>');

    expect(body).toContain(
      JSON.stringify({
        playgroundConfig: {
          core: {
            projectId: 'new-project',
            fixturesDir: '__fixtures__',
            fixtureFileSuffix: 'fixture',
            devServerOn: true,
            webRendererUrl: '/_renderer.html',
          },
        },
        pluginConfigs: [],
      })
    );

    await stopServer();
  });
});

it('serves playground JS', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

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

    const res1 = await fetch(`http://localhost:${port}/playground.bundle.js`);
    expect(res1.status).toBe(200);
    expect((await res1.text()).trim()).toBe('__mock_bundle__');

    const res2 = await fetch(
      `http://localhost:${port}/playground.bundle.js.map`
    );
    expect(res2.status).toBe(200);
    expect((await res2.text()).trim()).toBe('__mock_map__');

    await stopServer();
  });
});

it('serves favicon', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}/_cosmos.ico`);
    expect(res.status).toBe(200);

    expect(await res.text()).toEqual(
      readFileSync(path.join(__dirname, '../../static/favicon.ico'), 'utf8')
    );

    await stopServer();
  });
});

it('creates message handler', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    const client1 = new WebSocket(`ws://localhost:${port}`);
    const client2 = new WebSocket(`ws://localhost:${port}`);

    const message: SocketMessage<ServerMessage> = {
      channel: 'server',
      message: {
        type: 'buildStart',
      },
    };

    const onMessage = jest.fn();
    client1.addEventListener('open', () => {
      client1.addEventListener('message', msg => onMessage(msg.data));
      client2.addEventListener('open', () => {
        client2.send(JSON.stringify(message));
      });
    });

    await retry(() =>
      expect(onMessage).toBeCalledWith(JSON.stringify(message))
    );

    await stopServer();
  });
});

it('stops server', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');
    await stopServer();

    await expect(fetch(`http://localhost:${port}`)).rejects.toThrow(
      'ECONNREFUSED'
    );
  });
});

it('closes message handler clients', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    const stopServer = await startDevServer('web');

    const onOpen = jest.fn();
    const onClose = jest.fn();

    const client1 = new WebSocket(`ws://localhost:${port}`);
    client1.addEventListener('open', onOpen);
    client1.addEventListener('close', onClose);

    await retry(() => expect(onOpen).toBeCalled());
    await stopServer();
    await retry(() => expect(onClose).toBeCalled());
  });
});
