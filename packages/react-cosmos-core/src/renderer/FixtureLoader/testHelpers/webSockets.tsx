import { waitFor } from '@testing-library/react';
import { mapValues } from 'lodash-es';
import React from 'react';
import { create } from 'react-test-renderer';
import { WebSocketServer } from 'ws';
import {
  rendererSocketMessage,
  SocketMessage,
} from '../../../server/socketMessage.js';
import { FixtureConnect } from '../FixtureConnect.js';
import { createWebSocketsConnect } from '../webSockets.js';
import {
  createRendererConnectMockApi,
  FixtureLoaderTestArgs,
  FixtureLoaderTestCallback,
  RendererMessage,
} from './shared.js';

const port = 8000 + parseInt(process.env.JEST_WORKER_ID ?? '0', 10);

export async function mountWebSockets(
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  const onMessage = jest.fn();

  const wss = new WebSocketServer({ port });
  wss.on('connection', ws => {
    ws.on('message', msg => {
      onMessage(JSON.parse(msg.toString()));
    });
  });

  function getMessages() {
    return onMessage.mock.calls.map(
      call => (call[0] as SocketMessage<RendererMessage>).message
    );
  }

  function postMessage(msg: RendererMessage) {
    wss.clients.forEach(client =>
      client.send(JSON.stringify(rendererSocketMessage(msg)))
    );
  }

  async function cleanup() {
    wss.clients.forEach(client => client.close());
    wss.close();
    await waitFor(() => expect(wss.clients.size).toBe(0));
  }

  expect.hasAssertions();
  const renderer = create(getElement(args));
  try {
    await waitFor(() => expect(wss.clients.size).toBe(1));
    await cb({
      renderer,
      update: newArgs => renderer.update(getElement(newArgs)),
      ...createRendererConnectMockApi({ getMessages, postMessage }),
    });
  } finally {
    renderer.unmount();
    await cleanup();
  }
}

function getElement({ decorators = {}, ...otherArgs }: FixtureLoaderTestArgs) {
  const decoratorsWrappers = mapValues(decorators, decorator => {
    return { module: { default: decorator } };
  });
  return (
    <FixtureConnect
      {...otherArgs}
      rendererConnect={createWebSocketsConnect(`ws://localhost:${port}`)}
      lazy={false}
      decorators={decoratorsWrappers}
      systemDecorators={[]}
    />
  );
}
