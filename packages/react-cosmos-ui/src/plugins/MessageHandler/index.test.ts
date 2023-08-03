import { waitFor } from '@testing-library/dom';
import {
  BuildErrorMessage,
  RendererResponse,
  rendererSocketMessage,
  serverSocketMessage,
} from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { WebSocketServer } from 'ws';
import {
  getMessageHandlerMethods,
  mockCore,
  onMessageHandler,
} from '../../testHelpers/pluginMocks.js';
import { register } from './index.js';

beforeAll(() => {
  const jestWindow = window as any;
  delete jestWindow.location;
  jestWindow.location = { origin: 'http://localhost:8080' };
});

beforeEach(register);

afterEach(resetPlugins);

async function withWebSocketServer(
  cb: (args: {
    wss: WebSocketServer;
    onMessage: () => unknown;
  }) => Promise<void>
) {
  const onMessage = jest.fn();

  const wss = new WebSocketServer({ port: 8080 });
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
      expect(onMessage).toBeCalledWith(rendererSocketMessage(selectFixtureReq))
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
      },
    };

    const { rendererResponse } = onMessageHandler();
    wss.clients.forEach(client =>
      client.send(JSON.stringify(rendererSocketMessage(rendererReadyRes)))
    );

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

    const { serverMessage } = onMessageHandler();
    wss.clients.forEach(client =>
      client.send(JSON.stringify(serverSocketMessage(buildErrorMsg)))
    );

    await waitFor(() =>
      expect(serverMessage).toBeCalledWith(expect.any(Object), buildErrorMsg)
    );
  });
});
