// Import mocks first
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import '../../testHelpers/mockEsmStaticPath.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

import retry from '@skidding/async-retry';
import 'isomorphic-fetch';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ServerMessage, SocketMessage } from 'react-cosmos-core';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { startDevServer } from '../startDevServer.js';

// This became necessary since using fetch with { method: 'HEAD' } in
// dev server tests.
// Copied from https://github.com/prisma/prisma/issues/8558#issuecomment-1129055580
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

jest.mock('../../cosmosPlugin/pluginConfigs.js', () => {
  return {
    getPluginConfigs: jest.fn(() => []),
  };
});

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { port: 5001 });
});

afterEach(() => {
  unmockCliArgs();
  resetFsMock();
});

it('logs messages', async () => {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog('[Cosmos] See you at http://localhost:5001');

    const stopServer = await startDevServer('web');
    await stopServer();
  });
});

it('serves playground HTML', async () => {
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');

    const res = await fetch('http://localhost:5001');
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
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');

    const res1 = await fetch('http://localhost:5001/playground.bundle.js', {
      method: 'HEAD',
    });
    expect(res1.status).toBe(200);

    const res2 = await fetch('http://localhost:5001/playground.bundle.js.map', {
      method: 'HEAD',
    });
    expect(res2.status).toBe(200);

    await stopServer();
  });
});

it('serves favicon', async () => {
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');

    const res = await fetch('http://localhost:5001/_cosmos.ico');
    expect(res.status).toBe(200);

    expect(await res.text()).toEqual(
      readFileSync(path.join(__dirname, '../../static/favicon.ico'), 'utf8')
    );

    await stopServer();
  });
});

it('creates message handler', async () => {
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');

    const client1 = new WebSocket('ws://localhost:5001');
    const client2 = new WebSocket('ws://localhost:5001');

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
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');
    await stopServer();

    await expect(fetch('http://localhost:5001')).rejects.toThrow(
      'ECONNREFUSED'
    );
  });
});

it('closes message handler clients', async () => {
  return mockConsole(async () => {
    const stopServer = await startDevServer('web');

    const onOpen = jest.fn();
    const onClose = jest.fn();

    const client1 = new WebSocket('ws://localhost:5001');
    client1.addEventListener('open', onOpen);
    client1.addEventListener('close', onClose);

    await retry(() => expect(onOpen).toBeCalled());
    await stopServer();
    await retry(() => expect(onClose).toBeCalled());
  });
});
