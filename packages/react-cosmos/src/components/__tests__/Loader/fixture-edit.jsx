import React from 'react';
import { mount } from 'enzyme';
import Loader from '../../Loader';

// Objects to check identity against
const ProxyFoo = () => <span />;
const ComponentFoo = () => {};
const fixtureFoo = { foo: 'bar', onClick: () => {} };

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let firstProxyWrapper;
let firstProxyProps;
let firstProxyKey;

const handleParentMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type => new Promise(resolve => {
  messageHandlers[type] = resolve;
});

describe('Fixture is edited by parent frame', () => {
  beforeEach(() => {
    messageHandlers = {};
    parent.addEventListener('message', handleParentMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');
    const onFixtureSelect = waitForPostMessage('fixtureSelect');
    const onFixtureEdit = waitForPostMessage('fixtureEdit');
    wrapper = mount(
      <Loader
        proxies={[ProxyFoo]}
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

    return onFrameReady.then(() => {
      window.postMessage({
        type: 'fixtureSelect',
        component: 'Foo',
        fixture: 'foo',
      }, '*');

      return onFixtureSelect;
    }).then(() => {
      firstProxyKey = wrapper.find(ProxyFoo).key();

      window.postMessage({
        type: 'fixtureEdit',
        fixtureBody: {
          foo: 'baz'
        }
      }, '*');

      return onFixtureEdit;
    }).then(() => {
      firstProxyWrapper = wrapper.find(ProxyFoo);
      firstProxyProps = firstProxyWrapper.props();
    });
  });

  afterEach(() => {
    messageHandlers = {};
    parent.removeEventListener('message', handleParentMessage);
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
