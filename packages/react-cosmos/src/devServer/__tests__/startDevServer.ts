// Import mocks first
import { jestWorkerId } from '../../testHelpers/jestWorkerId.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import 'isomorphic-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import { retry, ServerMessage, SocketMessage } from 'react-cosmos-core';
import { startDevServer } from '../startDevServer.js';

mockCosmosPlugins([]);

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
  mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port,
  });
});

afterEach(async () => {
  await stopServer();
  unmockCliArgs();
  resetFsMock();
});

it('serves playground HTML', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain('<title>React Cosmos</title>');
    expect(html).toContain('<script src="playground.bundle.js"></script>');

    expect(html).toContain(
      JSON.stringify({
        playgroundConfig: {
          core: {
            projectId: 'react-cosmos',
            fixturesDir: '__fixtures__',
            fixtureFileSuffix: 'fixture',
            devServerOn: true,
            webRendererUrl: '/_renderer.html',
          },
          rendererCore: { fixtures: {} },
        },
        pluginConfigs: [],
      })
    );
  });
});

it('serves playground JS', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const res1 = await fetch(`http://localhost:${port}/playground.bundle.js`);
    expect(res1.status).toBe(200);
    expect((await res1.text()).trim()).toBe('__mock_bundle__');

    const res2 = await fetch(
      `http://localhost:${port}/playground.bundle.js.map`
    );
    expect(res2.status).toBe(200);
    expect((await res2.text()).trim()).toBe('__mock_map__');
  });
});

it('serves favicon', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

    const res = await fetch(`http://localhost:${port}/_cosmos.ico`);
    expect(res.status).toBe(200);

    expect(await res.text()).toEqual(
      await fs.readFile(
        path.join(__dirname, '../../static/favicon.ico'),
        'utf8'
      )
    );
  });
});

it('creates message handler', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');

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
  });
});

it('stops server', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');
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

    _stopServer = await startDevServer('web');

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
