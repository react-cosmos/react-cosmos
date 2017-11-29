// @flow

import React from 'react';
import { until } from 'react-cosmos-shared/src/jest';

import type { LoaderMessageData } from 'react-cosmos-shared/src/types';
import type { Renderer } from '../../types';

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

export const unmount: () => any = jest.fn();
export const renderer: Renderer = jest.fn(() => {
  return {
    unmount
  };
});

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
  return until(receivedEvent(eventType), `No ${eventType} event detected`);
}

export function postWindowMessage(msg: LoaderMessageData) {
  window.postMessage(msg, '*');
}
