import * as React from 'react';
import { create } from 'react-test-renderer';
import { PostMessage } from '..';
import {
  Message,
  MountFixtureConnectArgs,
  FixtureConnectTestApi,
  createFixtureConnectMockApi,
  createFixtureConnectRenderCb
} from './shared';

export async function mountPostMessage(
  args: MountFixtureConnectArgs,
  cb: (api: FixtureConnectTestApi) => void
) {
  const onMessage = jest.fn();
  window.addEventListener('message', onMessage, false);

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  function postMessage(msg: Message) {
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
      ...createFixtureConnectMockApi({ getMessages, postMessage })
    });
  } finally {
    renderer.unmount();
    cleanup();
  }
}

function getElement(args: MountFixtureConnectArgs) {
  return <PostMessage>{createFixtureConnectRenderCb(args)}</PostMessage>;
}
