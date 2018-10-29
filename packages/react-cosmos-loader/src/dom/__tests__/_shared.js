// @flow

import React from 'react';
import until from 'async-until';
import deepEqual from 'deep-equal';

import type { LoaderMessage } from 'react-cosmos-flow/loader';

export const ProxyFoo = () => <span />;
export const proxies = [ProxyFoo];

export const fixtureFoo = { component: () => {}, foo: true, fooFn: () => {} };
export const fixtureBar = { component: () => {}, bar: true };
export const fixtures = {
  Foo: {
    foo: fixtureFoo
  },
  Bar: {
    bar: fixtureBar
  }
};

export const handleMessage: () => any = jest.fn();

export function subscribeToWindowMessages() {
  beforeEach(() => {
    window.addEventListener('message', handleMessage, false);
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });
}

export function getLastWindowMessage() {
  const { calls } = handleMessage.mock;

  return calls[calls.length - 1][0].data;
}

export function receivedEvent(eventType: string) {
  return () =>
    handleMessage.mock.calls.length > 0 &&
    getLastWindowMessage().type === eventType;
}

export async function untilEvent(eventType: string) {
  return until(receivedEvent(eventType), {
    failMsg: `No ${eventType} event detected`,
    timeout: 1000
  });
}

export async function untilEventSeq(eventTypes: Array<string>) {
  try {
    await until(() => deepEqual(getEventSeq(eventTypes.length), eventTypes), {
      timeout: 1000
    });
  } catch (err) {
    // This always fails, but it's nice to see the diff
    expect(getEventSeq(eventTypes.length)).toEqual(eventTypes);
  }
}

export function postWindowMessage(msg: LoaderMessage) {
  window.postMessage(msg, '*');
}

function getEventSeq(len: ?number): Array<string> {
  const { calls } = handleMessage.mock;
  const types = calls.map(call => call[0].data.type);

  return len ? types.slice(types.length - len) : types;
}
