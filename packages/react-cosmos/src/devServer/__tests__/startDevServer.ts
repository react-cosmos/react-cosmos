// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosPlugins } from '../../testHelpers/mockCosmosPlugins.js';
import { mockCosmosConfig } from '../../testHelpers/mockFs.js';
import { mockCliArgs } from '../../testHelpers/mockYargs.js';

import retry from '@skidding/async-retry';
import 'isomorphic-fetch';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ServerMessage, SocketMessage } from 'react-cosmos-core';
import {
  jestNodeVersion,
  jestWorkerId,
} from '../../testHelpers/jestProcessUtils.js';
import { mockConsole } from '../../testHelpers/mockConsole.js';
import { startDevServer } from '../startDevServer.js';

mockCosmosPlugins([]);

const port = 5000 + jestWorkerId();

let _stopServer: (() => Promise<unknown>) | undefined;

beforeAll(async () => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', {
    rootDir: __dirname,
    port,
    rendererUrl: '/_renderer.html',
  });

  await mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using cosmos config found at cosmos.config.json');
    expectLog(`[Cosmos] See you at http://localhost:${port}`);

    _stopServer = await startDevServer('web');
  });
});

it('serves playground HTML', async () => {
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
        },
        rendererCore: {
          fixtures: {},
          rendererUrl: '/_renderer.html',
        },
      },
      pluginConfigs: [],
    })
  );
});

it('serves playground JS', async () => {
  const res1 = await fetch(`http://localhost:${port}/playground.bundle.js`);
  expect(res1.status).toBe(200);
  expect((await res1.text()).trim()).toBe('__mock_bundle__');

  const res2 = await fetch(`http://localhost:${port}/playground.bundle.js.map`);
  expect(res2.status).toBe(200);
  expect((await res2.text()).trim()).toBe('__mock_map__');
});

it('serves favicon', async () => {
  const res = await fetch(`http://localhost:${port}/_cosmos.ico`);
  expect(res.status).toBe(200);

  expect(await res.text()).toEqual(
    await fs.readFile(path.join(__dirname, '../../static/favicon.ico'), 'utf8')
  );
});

it('creates message handler', async () => {
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

  await retry(() => expect(onMessage).toBeCalledWith(JSON.stringify(message)));
});

it('stops server and closes message handler clients', async () => {
  const client1 = new WebSocket(`ws://localhost:${port}`);

  const onOpen = jest.fn();
  client1.addEventListener('open', onOpen);
  await retry(() => expect(onOpen).toBeCalled());

  const onClose = jest.fn();
  client1.addEventListener('close', onClose);

  await _stopServer!();
  await retry(() => expect(onClose).toBeCalled());

  await expect(fetch(`http://localhost:${port}`)).rejects.toThrow(
    jestNodeVersion() >= 20
      ? `request to http://localhost:${port}/ failed`
      : 'ECONNREFUSED'
  );
});
