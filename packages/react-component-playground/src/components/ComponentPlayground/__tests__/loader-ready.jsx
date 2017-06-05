import React from 'react';
import { mount } from 'enzyme';
import FixtureList from '../../FixtureList';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let router;
let wrapper;

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

describe('CP loader ready', () => {
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
        loaderUri="/loader/index.html"
        router={router}
      />
    );

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

  test('should render fixture list', () => {
    expect(wrapper.find(FixtureList).length).toEqual(1);
  });

  test('should send fixtures to fixture list', () => {
    expect(wrapper.find(FixtureList).prop('fixtures')).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux'],
    });
  });

  test('should send empty url params to fixture list', () => {
    const urlParams = wrapper.find(FixtureList).prop('urlParams');
    expect(Object.keys(urlParams)).toEqual([]);
  });

  test('should go to URL from fixture list handler', () => {
    const onUrlChange = wrapper.find(FixtureList).prop('onUrlChange');
    onUrlChange('/path/to/location');
    expect(router.goTo).toHaveBeenCalledWith('/path/to/location');
  });
});
