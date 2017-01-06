import React from 'react';
import { mount } from 'enzyme';

let origAddEventListener;
let origRemoveEventListener;
let origParentPostMessage;

const stubWindowApi = () => {
  origParentPostMessage = parent.postMessage;
  parent.postMessage = jest.fn();
  origAddEventListener = window.addEventListener;
  window.addEventListener = jest.fn();
  origRemoveEventListener = window.removeEventListener;
  window.removeEventListener = jest.fn();
};

const revertWindowApi = () => {
  parent.postMessage = origParentPostMessage;
  window.addEventListener = origAddEventListener;
  window.removeEventListener = origRemoveEventListener;
};

const mockProxyNext = {};
const mockFirstProxy = {
  value: () => <span />,
  next: () => mockProxyNext,
};
const mockGetLinkedList = jest.fn(() => mockFirstProxy);
jest.mock('react-cosmos-utils/lib/linked-list', () => mockGetLinkedList);


const mockFixtureParts = {
  unserializable: {
    onClick: jest.fn(),
  },
  serializable: {
    title: 'Lorem ipsum',
  },
};
const mockSplitUnserializableParts = jest.fn(() => mockFixtureParts);
jest.mock('react-cosmos-utils/lib/unserializable-parts', () => mockSplitUnserializableParts);

const Loader = require('../Loader').default;

const Proxy = jest.fn();
const FooBarComponent = () => {};
const baseFixture = {};

let wrapper;
let instance;

const init = () => {
  wrapper = mount(
    <Loader
      proxies={[Proxy]}
      components={{
        FooBar: FooBarComponent,
      }}
      fixtures={{
        FooBar: {
          base: baseFixture,
        },
      }}
    />,
  );
  instance = wrapper.instance();
};

beforeAll(() => {
  stubWindowApi();
  init();
});

afterAll(() => {
  revertWindowApi();
});

test('renders nothing at first', () => {
  expect(wrapper.html()).toBe(null);
});

test('subscribes to message events', () => {
  const { onMessage } = instance;
  expect(window.addEventListener).toHaveBeenLastCalledWith('message', onMessage, false);
});

test('notifies parent frames on load', () => {
  expect(parent.postMessage).toHaveBeenLastCalledWith({ type: 'frameReady' }, '*');
});

test('creates linked list from proxy list', () => {
  expect(mockGetLinkedList).toHaveBeenLastCalledWith([Proxy]);
});

describe('on `fixtureLoad` event', () => {
  let firstProxyWrapper;
  let firstProxyProps;
  let firstProxyKey;

  beforeAll(() => {
    const { onMessage } = instance;
    onMessage({
      data: {
        type: 'fixtureLoad',
        component: 'FooBar',
        fixture: 'base',
      },
    });
    firstProxyWrapper = wrapper.find(mockFirstProxy.value);
    firstProxyProps = firstProxyWrapper.props();
    firstProxyKey = firstProxyWrapper.key();
  });

  test('renders first proxy ', () => {
    expect(firstProxyWrapper.length).toBe(1);
  });

  test('sets first proxy element key ', () => {
    expect(firstProxyKey).toBeDefined();
  });

  test('sends next proxy to first proxy ', () => {
    expect(firstProxyProps.nextProxy).toBe(mockProxyNext);
  });

  test('sends component to first proxy ', () => {
    expect(firstProxyProps.component).toBe(FooBarComponent);
  });

  test('splits unserializable parts from fixture', () => {
    expect(mockSplitUnserializableParts).toHaveBeenLastCalledWith(baseFixture);
  });

  test('sends merged fixture parts to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual({
      ...mockFixtureParts.unserializable,
      ...mockFixtureParts.serializable,
    });
  });

  test('sends onFixtureUpdate cb to first proxy ', () => {
    expect(firstProxyProps.onFixtureUpdate).toBe(instance.onFixtureUpdate);
  });

  describe('on `fixtureLoad` event with fixture body', () => {
    const fixtureBody = {
      title: 'We are the robots',
    };

    beforeAll(() => {
      const { onMessage } = instance;
      onMessage({
        data: {
          type: 'fixtureLoad',
          component: 'FooBar',
          fixture: 'base',
          fixtureBody,
        },
      });
      firstProxyWrapper = wrapper.find(mockFirstProxy.value);
      firstProxyProps = firstProxyWrapper.props();
    });

    test('includes body received in fixture sent to first proxy', () => {
      expect(firstProxyProps.fixture).toEqual({
        ...mockFixtureParts.unserializable,
        ...fixtureBody,
      });
    });

    test('changes element key', () => {
      expect(firstProxyWrapper.key()).not.toEqual(firstProxyKey);
    });
  });
});

test('publishes message to parent on fixture update', () => {
  const { onFixtureUpdate } = instance;
  const updatedFixture = {};
  onFixtureUpdate(updatedFixture);
  expect(parent.postMessage).toHaveBeenLastCalledWith({
    type: 'fixtureUpdate',
    fixtureBody: updatedFixture,
  }, '*');
});

test('unsubscribes from message events on unmount', () => {
  const { onMessage } = instance;
  wrapper.unmount();
  expect(window.removeEventListener).toHaveBeenLastCalledWith('message', onMessage);
});
