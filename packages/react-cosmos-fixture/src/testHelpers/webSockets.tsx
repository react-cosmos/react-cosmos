import * as React from 'react';
import * as io from 'socket.io-client';
import { create, act } from 'react-test-renderer';
import { FixtureLoader, createWebSocketsConnect } from '..';
import {
  MountFixtureLoaderArgs,
  MountFixtureCallback,
  createRendererConnectMockApi
} from './shared';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

export async function mountWebSockets(
  args: MountFixtureLoaderArgs,
  cb: MountFixtureCallback
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
  decorators,
  onFixtureChange
}: MountFixtureLoaderArgs) {
  return (
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={createWebSocketsConnect(WS_URL)}
      fixtures={fixtures}
      systemDecorators={[]}
      userDecorators={decorators}
      onFixtureChange={onFixtureChange}
    />
  );
}
