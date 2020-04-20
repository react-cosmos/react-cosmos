import React from 'react';
import { act, create } from 'react-test-renderer';
import { createPostMessageConnect, FixtureLoader } from '..';
import {
  createRendererConnectMockApi,
  FixtureLoaderTestCallback,
  Message,
  FixtureLoaderTestArgs,
} from './shared';

export async function mountPostMessage(
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
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
      ...createRendererConnectMockApi({ getMessages, postMessage }),
    });
  } finally {
    renderer.unmount();
    cleanup();
  }
}

function getElement({
  rendererId,
  fixtures,
  selectedFixtureId = null,
  decorators = {},
  onErrorReset,
}: FixtureLoaderTestArgs) {
  return (
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={createPostMessageConnect()}
      fixtures={fixtures}
      selectedFixtureId={selectedFixtureId}
      systemDecorators={[]}
      userDecorators={decorators}
      onErrorReset={onErrorReset}
    />
  );
}
