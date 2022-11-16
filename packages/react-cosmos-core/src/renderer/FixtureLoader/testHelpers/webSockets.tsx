import React from 'react';
import { act, create } from 'react-test-renderer';
import { io } from 'socket.io-client';
import { FixtureLoader } from '../FixtureLoader.js';
import { createWebSocketsConnect } from '../webSockets.js';
import {
  createRendererConnectMockApi,
  FixtureLoaderTestArgs,
  FixtureLoaderTestCallback,
} from './shared.js';

// __getMockApi is defined in mockSocketIo.js
const { WS_URL, getMessages, postMessage, resetMessages } = (
  io as any
).__getMockApi();

export async function mountWebSockets(
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  expect.hasAssertions();
  const renderer = create(getElement(args));
  try {
    await cb({
      renderer,
      update: newArgs =>
        act(() => {
          renderer.update(getElement(newArgs));
        }),
      ...createRendererConnectMockApi({ getMessages, postMessage }),
    });
  } finally {
    renderer.unmount();
    resetMessages();
  }
}

function getElement({ decorators = {}, ...otherArgs }: FixtureLoaderTestArgs) {
  return (
    <FixtureLoader
      {...otherArgs}
      rendererConnect={createWebSocketsConnect(WS_URL)}
      systemDecorators={[]}
      userDecorators={decorators}
    />
  );
}
