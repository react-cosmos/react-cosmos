import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const fixtureFoo = { foo: 'bar', onClick: () => {} };

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

describe('Fixture is edited by parent frame', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureEdit = waitForPostMessage('fixtureEdit');
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

        window.postMessage(
          {
            type: 'fixtureEdit',
            fixtureBody: {
              foo: 'baz'
            }
          },
          '*'
        );

        return onFixtureEdit;
      })
      .then(() => {
        wrapper.update();
        firstProxyWrapper = wrapper.find(ProxyFoo);
        firstProxyProps = firstProxyWrapper.props();
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('sends updated (merged) fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual({
      ...fixtureFoo,
      foo: 'baz'
    });
  });

  test('changes element key', () => {
    expect(firstProxyWrapper.key()).not.toEqual(firstProxyKey);
  });
});
