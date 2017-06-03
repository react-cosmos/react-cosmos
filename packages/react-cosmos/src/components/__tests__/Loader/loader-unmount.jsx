import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ComponentFoo = () => {};
const fixtureFoo = {};

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let instance;

const handleMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type => new Promise(resolve => {
  messageHandlers[type] = resolve;
});

describe('Loader unmounts', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    wrapper = mount(
      <Loader
        proxies={[]}
        components={{
          Foo: ComponentFoo,
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo,
          }
        }}
      />,
    );
    instance = wrapper.instance();

    return onFrameReady.then(() => {
      instance.setState = jest.fn();

      wrapper.unmount();

      window.postMessage({
        type: 'fixtureSelect',
        component: 'Foo',
        fixture: 'foo',
      }, '*');

      return onFixtureSelect;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('does not respond to events', () => {
    expect(instance.setState).not.toHaveBeenCalled();
  });
});
