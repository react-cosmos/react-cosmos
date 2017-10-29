import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const fixtureFoo = { foo: 'bar', onClick: () => {} };
const fixtureFoo2 = { foo: 'baz' };

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let firstProxyKey;

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

describe('Fixture source changes', () => {
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
        wrapper.update();
        firstProxyKey = wrapper.find(ProxyFoo).key();

        wrapper.setProps({
          fixtures: {
            Foo: {
              foo: fixtureFoo2
            }
          }
        });

        firstProxyWrapper = wrapper.find(ProxyFoo);
        firstProxyProps = firstProxyWrapper.props();
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('keeps sending previous fixture body to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual(fixtureFoo);
  });

  test('does not change element key', () => {
    expect(firstProxyWrapper.key()).toEqual(firstProxyKey);
  });
});
