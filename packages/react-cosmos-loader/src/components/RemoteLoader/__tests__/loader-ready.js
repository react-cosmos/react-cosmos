import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ComponentFoo = () => {};
const ComponentBar = () => {};
const fixtureFoo = {};
const fixtureBar = {};

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let loaderReadyMessage;

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

describe('Loader is ready', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    wrapper = mount(
      <RemoteLoader
        proxies={[]}
        components={{
          Foo: ComponentFoo,
          Bar: ComponentBar,
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo,
          },
          Bar: {
            bar: fixtureBar,
          },
        }}
      />
    );

    return onFrameReady.then(data => {
      loaderReadyMessage = data;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('renders nothing at first', () => {
    expect(wrapper.html()).toBe(null);
  });

  test('notifies parent frames on load', () => {
    expect(loaderReadyMessage).toEqual({
      type: 'loaderReady',
      fixtures: {
        Foo: ['foo'],
        Bar: ['bar'],
      },
    });
  });
});
