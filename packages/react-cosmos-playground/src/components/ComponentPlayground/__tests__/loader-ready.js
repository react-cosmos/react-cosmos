import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import initFixture from '../__fixtures__/init';

const FetchProxy = createFetchProxy();

// Vars populated in beforeEach blocks
let messageHandlers;
let instance;

const handleMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type =>
  new Promise(resolve => {
    messageHandlers[type] = resolve;
  });

describe('CP loader ready', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');

    // Mount component in order for ref and lifecycle methods to be called
    mount(
      <Loader
        proxies={[FetchProxy]}
        fixture={initFixture}
        onComponentRef={i => {
          instance = i;
        }}
      />
    );

    return Promise.resolve().then(() => {
      window.postMessage(
        {
          type: 'loaderReady',
          fixtures: {
            ComponentA: ['foo', 'bar'],
            ComponentB: ['baz', 'qux']
          }
        },
        '*'
      );

      return onFrameReady;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('should set waitingForLoader to false', () => {
    expect(instance.state.waitingForLoader).toBe(false);
  });

  test('should add fixtures to state', () => {
    expect(instance.state.fixtures).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux']
    });
  });
});
