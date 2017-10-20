import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = () => {};
const fixtureFoo = { foo: 'bar', onClick: () => {} };

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;

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

describe('Fixture source removal', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    wrapper = mount(
      <RemoteLoader
        proxies={[ProxyFoo]}
        components={{
          Foo: ComponentFoo
        }}
        fixtures={{
          Foo: {
            foo: fixtureFoo
          }
        }}
      />
    );

    return onFrameReady
      .then(() => {
        window.postMessage(
          {
            type: 'fixtureSelect',
            component: 'Foo',
            fixture: 'foo'
          },
          '*'
        );

        return onFixtureSelect;
      })
      .then(() => {
        wrapper.setProps({
          fixtures: {
            Foo: {}
          }
        });

        firstProxyWrapper = wrapper.find(ProxyFoo);
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('stops rendering proxies', () => {
    expect(firstProxyWrapper).toHaveLength(0);
  });
});
