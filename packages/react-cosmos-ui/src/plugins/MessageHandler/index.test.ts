import { waitFor } from '@testing-library/dom';
import {
  BuildErrorMessage,
  RendererResponse,
  SocketMessage,
} from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { WebSocketServer } from 'ws';
import { register } from '.';
import {
  getMessageHandlerMethods,
  mockCore,
  onMessageHandler,
} from '../../testHelpers/pluginMocks.js';

beforeEach(register);

afterEach(resetPlugins);

async function withWebSocketServer(
  cb: (args: {
    wss: WebSocketServer;
    onMessage: () => unknown;
  }) => Promise<void>
) {
  const onMessage = jest.fn();

  const wss = new WebSocketServer({ port: 80 });
  wss.on('connection', ws => {
    ws.on('message', msg => {
      onMessage(JSON.parse(msg.toString()));
    });
  });

  await cb({ wss, onMessage });

  wss.clients.forEach(client => client.close());
  wss.close();
}

function registerTestPlugins() {
  mockCore({
    isDevServerOn: () => true,
  });
}

it('emits renderer request externally', async () => {
  await withWebSocketServer(async ({ onMessage }) => {
    registerTestPlugins();
    loadPlugins();

    const selectFixtureReq = {
      type: 'selectFixture',
      payload: {
        rendererId: 'mockRendererId',
        fixtureId: { path: 'mockFixturePath', name: null },
        fixtureState: {},
      },
    };
    const messageHandler = getMessageHandlerMethods();
    messageHandler.postRendererRequest(selectFixtureReq);

    await waitFor(() =>
      expect(onMessage).toBeCalledWith({
        eventName: 'renderer',
        body: selectFixtureReq,
      })
    );
  });
});

it('emits renderer response internally', async () => {
  await withWebSocketServer(async ({ wss }) => {
    registerTestPlugins();
    loadPlugins();
    await waitFor(() => expect(wss.clients.size).toBe(1));

    const rendererReadyRes: RendererResponse = {
      type: 'rendererReady',
      payload: {
        rendererId: 'mockRendererId',
        fixtures: {
          'ein.js': { type: 'single' },
          'zwei.js': { type: 'single' },
          'drei.js': { type: 'single' },
        },
      },
    };
    const socketMessage: SocketMessage = {
      eventName: 'renderer',
      body: rendererReadyRes,
    };

    const { rendererResponse } = onMessageHandler();
    wss.clients.forEach(client => client.send(JSON.stringify(socketMessage)));

    await waitFor(() =>
      expect(rendererResponse).toBeCalledWith(
        expect.any(Object),
        rendererReadyRes
      )
    );
  });
});

it('emits server message internally', async () => {
  await withWebSocketServer(async ({ wss }) => {
    registerTestPlugins();
    loadPlugins();
    await waitFor(() => expect(wss.clients.size).toBe(1));

    const buildErrorMsg: BuildErrorMessage = {
      type: 'buildError',
    };
    const socketMessage: SocketMessage = {
      eventName: 'server',
      body: buildErrorMsg,
    };

    const { serverMessage } = onMessageHandler();
    wss.clients.forEach(client => client.send(JSON.stringify(socketMessage)));

    await waitFor(() =>
      expect(serverMessage).toBeCalledWith(expect.any(Object), buildErrorMsg)
    );
  });
});
