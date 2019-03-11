import * as React from 'react';
import { PostMessage } from '..';
import {
  Message,
  createFixtureConnectRenderCallback,
  createConnectMock,
  FixtureConnectUserProps
} from './shared';

export const mockPostMessage = createConnectMock(() => {
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

  return {
    getElement,
    getMessages,
    postMessage,
    cleanup
  };
});

function getElement(userProps: FixtureConnectUserProps) {
  return (
    <PostMessage>{createFixtureConnectRenderCallback(userProps)}</PostMessage>
  );
}
