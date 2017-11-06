import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import MissingScreen from '../../screens/MissingScreen';
import selectedFixture from '../__fixtures__/selected-missing';

const StateProxy = createStateProxy();
const FetchProxy = createFetchProxy();

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;
let instance;
let loaderContentWindow;

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

describe('CP with missing fixture already selected', () => {
  beforeEach(async () => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    const onFrameReady = waitForPostMessage('loaderReady');

    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader
        proxies={[StateProxy, FetchProxy]}
        fixture={selectedFixture}
        onComponentRef={i => {
          instance = i;
        }}
      />
    );

    loaderContentWindow = {
      postMessage: jest.fn()
    };
    // iframe.contentWindow isn't available in jsdom
    instance.loaderFrame = {
      contentWindow: loaderContentWindow
    };

    // State is already injected, but we need to trigger this event for the
    // `fixtureSelect` message event to be triggered
    window.postMessage(
      {
        type: 'loaderReady',
        fixtures: selectedFixture.state.fixtures
      },
      '*'
    );

    await onFrameReady;

    wrapper.update();
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('does not send fixture select message to loader', () => {
    expect(loaderContentWindow.postMessage).not.toHaveBeenCalled();
  });

  test('renders MissingScreen', () => {
    expect(wrapper.find(MissingScreen)).toHaveLength(1);
  });

  test('sends component name to MissingScreen', () => {
    const { componentName } = wrapper.find(MissingScreen).props();
    expect(componentName).toBe('ComponentA');
  });

  test('sends fixture name to MissingScreen', () => {
    const { fixtureName } = wrapper.find(MissingScreen).props();
    expect(fixtureName).toBe('foot');
  });
});
