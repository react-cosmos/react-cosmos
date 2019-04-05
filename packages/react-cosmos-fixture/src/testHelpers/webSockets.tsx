import * as React from 'react';
import * as io from 'socket.io-client';
import { create, act } from 'react-test-renderer';
import { FixtureConnect, createWebSocketsConnect } from '..';
import {
  MountFixtureConnectArgs,
  MountFixtureCallback,
  createFixtureConnectMockApi
} from './shared';

// __getMockApi is defined in mockSocketIo.js
const {
  WS_URL,
  getMessages,
  postMessage,
  resetMessages
} = (io as any).__getMockApi();

export async function mountWebSockets(
  args: MountFixtureConnectArgs,
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
      ...createFixtureConnectMockApi({ getMessages, postMessage })
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
}: MountFixtureConnectArgs) {
  return (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      systemDecorators={[]}
      userDecorators={decorators}
      onFixtureChange={onFixtureChange}
      connect={createWebSocketsConnect(WS_URL)}
    />
  );
}
