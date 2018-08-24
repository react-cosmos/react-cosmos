/* eslint-env browser, jest */
// @flow

import until from 'async-until';
import { isEqual } from 'lodash';

type Args = {
  lastMessage: () => Object,
  messageSeq: (...Array<string>) => Promise<mixed>,
  postMessage: (msg: Object) => Promise<mixed>
};

const timeout = 1000;

export async function mockPostMessage(children: Args => mixed) {
  const onMessage = jest.fn();

  async function messageSeq(...types) {
    await until(() => getCalls().length >= types.length, { timeout });

    const actualTypes = getCalls().map(call => call[0].data.type);
    expect(actualTypes).toEqual(types);
  }

  function lastMessage() {
    const calls = getCalls();

    if (calls.length === 0) {
      throw new Error('No message has been posted');
    }

    return calls[calls.length - 1][0].data;
  }

  function getCalls() {
    return onMessage.mock.calls;
  }

  async function postMessage(msg) {
    const numCalls = getCalls().length;
    parent.postMessage(msg, '*');

    // This is very convenient because we don't have to await manually for each
    // dispatched event to be fulfilled inside test cases
    try {
      await until(
        () => getCalls().length > numCalls && isEqual(lastMessage(), msg),
        { timeout }
      );
    } catch (err) {
      console.log(err);
    }
  }

  window.addEventListener('message', onMessage, false);
  try {
    await children({ lastMessage, messageSeq, postMessage });
  } finally {
    window.removeEventListener('message', onMessage);
  }
}
