import React from 'react';
import { mount } from 'enzyme';
import FixtureList from '../../FixtureList';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let router;
let wrapper;
let loaderContentWindow;

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

describe('CP with fixture already selected', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    router = {
      goTo: jest.fn()
    };

    const onFrameReady = waitForPostMessage('loaderReady');

    // Mounting component in order for lifecycle methods to be called
    wrapper = mount(
      <ComponentPlayground
        component="ComponentA"
        fixture="foo"
        loaderUri="/loader/index.html"
        router={router}
      />
    );

    loaderContentWindow = {
      postMessage: jest.fn()
    };
    // iframe.contentWindow isn't available in jsdom
    wrapper.instance().loaderFrame = {
      contentWindow: loaderContentWindow
    };

    window.postMessage({
      type: 'loaderReady',
      fixtures: {
        ComponentA: ['foo', 'bar'],
        ComponentB: ['baz', 'qux'],
      }
    }, '*');

    return onFrameReady;
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('should send url params (component, fixture) to fixture list', () => {
    const urlParams = wrapper.find(FixtureList).prop('urlParams');
    expect(urlParams).toEqual({
      component: 'ComponentA',
      fixture: 'foo',
    });
  });

  test('sends fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).toHaveBeenCalledWith({
      type: 'fixtureSelect',
      component: 'ComponentA',
      fixture: 'foo',
    }, '*');
  });
});
