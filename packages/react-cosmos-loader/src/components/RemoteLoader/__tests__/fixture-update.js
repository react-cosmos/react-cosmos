import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const createProxyFoo = () => ProxyFoo;
const ComponentFoo = () => {};
const fixtureFoo = { foo: 'bar', onClick: () => {} };
const fixtureFoo2 = { foo: 'baz' };

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let firstProxyKey;
let fixtureUpdateMessage;

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

describe('Fixture content updated by proxies', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureUpdate = waitForPostMessage('fixtureUpdate');
    wrapper = mount(
      <RemoteLoader
        proxies={[createProxyFoo]}
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
        firstProxyKey = wrapper.find(ProxyFoo).key();

        const instance = wrapper.instance();
        instance.onFixtureUpdate(fixtureFoo2);

        firstProxyWrapper = wrapper.find(ProxyFoo);
        firstProxyProps = firstProxyWrapper.props();

        return onFixtureUpdate;
      })
      .then(data => {
        fixtureUpdateMessage = data;
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('sends updated fixture body to parent', () => {
    expect(fixtureUpdateMessage).toEqual({
      type: 'fixtureUpdate',
      component: 'Foo',
      fixture: 'foo',
      fixtureBody: fixtureFoo2
    });
  });

  test('sends updated (merged) fixture to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual({
      ...fixtureFoo,
      ...fixtureFoo2
    });
  });

  test('does not change element key', () => {
    expect(firstProxyWrapper.key()).toEqual(firstProxyKey);
  });
});
