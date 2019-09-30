import React from 'react';
import { act, create } from 'react-test-renderer';
import * as io from 'socket.io-client';
import { createWebSocketsConnect, FixtureLoader } from '..';
import {
  createRendererConnectMockApi,
  FixtureLoaderTestCallback,
  FixtureLoaderTestArgs
} from './shared';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

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
      ...createRendererConnectMockApi({ getMessages, postMessage })
    });
  } finally {
    renderer.unmount();
    resetMessages();
  }
}

function getElement({
  rendererId,
  fixtures,
  initialFixtureId,
  decorators = {},
  onErrorReset
}: FixtureLoaderTestArgs) {
  return (
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={createWebSocketsConnect(WS_URL)}
      fixtures={fixtures}
      initialFixtureId={initialFixtureId}
      systemDecorators={[]}
      userDecorators={decorators}
      onErrorReset={onErrorReset}
    />
  );
}
