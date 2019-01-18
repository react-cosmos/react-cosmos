/* eslint-env browser */
// @flow

import React from 'react';
import { PostMessage } from '..';
import {
  createFixtureConnectRenderCallback,
  createConnectMock
} from './shared';

export const mockPostMessage = createConnectMock(() => {
  const onMessage = jest.fn();
  window.addEventListener('message', onMessage, false);

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  function postMessage(msg) {
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

function getElement(userProps) {
  return (
    <PostMessage>{createFixtureConnectRenderCallback(userProps)}</PostMessage>
  );
}
