/* eslint-env browser */
// @flow

import React from 'react';
import { isEqual } from 'lodash';
import until from 'async-until';
import {
  testFixtureConnect,
  getLastMessage,
  getMessageSeq,
  expectMessageSeq
} from '../jestHelpers/commonTests';
import { PostMessage } from '../PostMessage';

import type { MockRemoteArgs } from '../jestHelpers/commonTests';

testFixtureConnect({
  mockRemoteApi,
  getRemoteApi: children => <PostMessage>{children}</PostMessage>
});

async function mockRemoteApi(children: MockRemoteArgs => Promise<mixed>) {
  const onMessage = jest.fn();

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  function lastMessage() {
    return getLastMessage(getMessages());
  }

  async function messageSeq(...types) {
    return expectMessageSeq(getMessages, types);
  }

  async function postMessage(msg) {
    const prevSeq = getMessageSeq(getMessages());
    parent.postMessage(msg, '*');

    // This is very convenient because we don't have to await manually for each
    // dispatched event to be fulfilled inside test cases
    await until(
      () => isEqual(getMessageSeq(getMessages()), [...prevSeq, msg.type]),
      { timeout: 1000 }
    );
  }

  window.addEventListener('message', onMessage, false);
  try {
    await children({ lastMessage, messageSeq, postMessage });
  } finally {
    window.removeEventListener('message', onMessage);
  }
}
