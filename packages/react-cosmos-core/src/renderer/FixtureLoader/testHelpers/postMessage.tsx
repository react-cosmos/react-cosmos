import { mapValues } from 'lodash-es';
import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureConnect } from '../FixtureConnect.js';
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
  }

  function cleanup() {
    window.removeEventListener('message', onMessage);
  }

  expect.hasAssertions();
  const renderer = create(getElement(args));
  try {
    await cb({
      renderer,
      update: newArgs => renderer.update(getElement(newArgs)),
      ...createRendererConnectMockApi({ getMessages, postMessage }),
    });
  } finally {
    renderer.unmount();
    cleanup();
  }
}

function getElement({
  fixtures,
  decorators = {},
  ...otherArgs
}: FixtureLoaderTestArgs) {
  const decoratorsWrappers = mapValues(decorators, decorator => {
    return { module: { default: decorator } };
  });
  return (
    <FixtureConnect
      {...otherArgs}
      rendererConnect={createPostMessageConnect()}
      moduleWrappers={{
        lazy: false,
        fixtures,
        decorators: decoratorsWrappers,
      }}
      systemDecorators={[]}
    />
  );
}
