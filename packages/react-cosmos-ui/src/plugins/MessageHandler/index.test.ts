import { waitFor } from '@testing-library/dom';
import type { BuildErrorMessage, RendererResponse } from 'react-cosmos-core';
import { rendererSocketMessage, serverSocketMessage } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { vi } from 'vitest';
import WebSocket from 'ws';
import {
  getMessageHandlerMethods,
  mockCore,
  onMessageHandler,
} from '../../testHelpers/pluginMocks.js';
import { register } from './index.js';

const WebSocketServer = (
  WebSocket as unknown as { Server: typeof import('ws').WebSocketServer }
).Server;
const originalWebSocket = global.WebSocket;
type Wss = InstanceType<typeof WebSocketServer>;

beforeAll(() => {
  global.WebSocket = WebSocket as unknown as typeof global.WebSocket;

  const testWindow = window as any;
  delete testWindow.location;
  testWindow.location = { origin: 'http://localhost:8080' };
});

afterAll(() => {
  global.WebSocket = originalWebSocket;
});

beforeEach(register);

afterEach(resetPlugins);

async function withWebSocketServer(
  cb: (args: { wss: Wss; onMessage: () => unknown }) => Promise<void>
) {
  const onMessage = vi.fn();

  const wss = new WebSocketServer({ port: 8080 });
  await new Promise<void>(resolve => {
    wss.on('listening', resolve);
  });
  wss.on('connection', ws => {
    ws.on('message', msg => {
      onMessage(JSON.parse(msg.toString()));
    });
  });

  try {
    await cb({ wss, onMessage });
  } finally {
    wss.clients.forEach(client => client.close());
    await new Promise<void>(resolve => {
      wss.close(() => resolve());
    });
  }
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
