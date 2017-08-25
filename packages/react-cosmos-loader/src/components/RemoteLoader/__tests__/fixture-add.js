import React from 'react';
import { mount } from 'enzyme';
import RemoteLoader from '../';

// Objects to check identity against
const ProxyFoo = () => <span />;
const createProxyFoo = () => ProxyFoo;
const ComponentFoo = () => {};
const fixtureFoo = {};
const fixtureBar = {};

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let fixtureListUpdateMessage;

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

describe('Fixture is added', () => {
  beforeEach(() => {
    messageHandlers = {};
    // window recieves both incoming and outgoing messages from/to parent because
    // window.parent === window in the Jest environment
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureListUpdate = waitForPostMessage('fixtureListUpdate');
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
        wrapper.setProps({
          fixtures: {
            Foo: {
              foo: fixtureFoo,
              bar: fixtureBar
            }
          }
        });

        return onFixtureListUpdate;
      })
      .then(data => {
        fixtureListUpdateMessage = data;
      });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('sends updated fixture list to parent', () => {
    expect(fixtureListUpdateMessage).toEqual({
      type: 'fixtureListUpdate',
      fixtures: {
        Foo: ['foo', 'bar']
      }
    });
  });
});
