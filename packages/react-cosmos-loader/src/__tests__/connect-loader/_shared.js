// @flow

import React from 'react';

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

export function postWindowMessage(msg: LoaderMessageData) {
  window.postMessage(msg, '*');
}

export function until(
  cb: () => boolean,
  failMsg: string,
  timeout: number = 100
): Promise<any> {
  const t1 = Date.now();

  return new Promise((resolve, reject) => {
    function loop() {
      if (cb()) {
        resolve();
      } else if (Date.now() - t1 < timeout) {
        setTimeout(loop);
      } else {
        reject(failMsg);
      }
    }
    loop();
  });
}

type JestMock = {
  calls: Array<Array<any>>
};

export function getMock(fn: any): JestMock {
  return fn.mock;
}
