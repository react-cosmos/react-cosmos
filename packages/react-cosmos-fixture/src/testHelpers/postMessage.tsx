import * as React from 'react';
import { create, act } from 'react-test-renderer';
import { FixtureConnect, createPostMessageConnect } from '..';
import {
  Message,
  MountFixtureConnectArgs,
  MountFixtureCallback,
  createFixtureConnectMockApi
} from './shared';

export async function mountPostMessage(
  args: MountFixtureConnectArgs,
  cb: MountFixtureCallback
) {
  const onMessage = jest.fn();
  window.addEventListener('message', onMessage, false);

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  function postMessage(msg: Message) {
    parent.postMessage(msg, '*');
    // window message events are received in the next
    // frame, which is why we have to skip a loop before
    // executing React updates
    setTimeout(() => {
      act(() => {});
    });
  }

  function cleanup() {
    window.removeEventListener('message', onMessage);
  }

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
    cleanup();
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
      connect={createPostMessageConnect()}
    />
  );
}
