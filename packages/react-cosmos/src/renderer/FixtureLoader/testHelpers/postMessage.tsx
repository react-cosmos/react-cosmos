import React from 'react';
import { act, create } from 'react-test-renderer';
import { FixtureLoader } from '../FixtureLoader.js';
import { createPostMessageConnect } from '../postMessage.js';
import {
  createRendererConnectMockApi,
  FixtureLoaderTestArgs,
  FixtureLoaderTestCallback,
  RendererMessage,
} from './shared.js';

export async function mountPostMessage(
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  const onMessage = jest.fn();
  window.addEventListener('message', onMessage, false);

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  function postMessage(msg: RendererMessage) {
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

function getElement({ decorators = {}, ...otherArgs }: FixtureLoaderTestArgs) {
  return (
    <FixtureLoader
      {...otherArgs}
      rendererConnect={createPostMessageConnect()}
      systemDecorators={[]}
      userDecorators={decorators}
    />
  );
}
