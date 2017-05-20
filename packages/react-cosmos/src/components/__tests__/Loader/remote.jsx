import React from 'react';
import { mount } from 'enzyme';

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

const Loader = require('../../Loader').default;

const Proxy = jest.fn();
const FooBarComponent = () => {};
const FooBarBarComponent = () => {};
const baseFixture = {};

let wrapper;
let instance;

const init = () => {
  wrapper = mount(
    <Loader
      proxies={[Proxy]}
      components={{
        FooBar: FooBarComponent,
        FooBarBar: FooBarBarComponent,
      }}
      fixtures={{
        FooBar: {
          base: baseFixture,
        },
        FooBarBar: {
          base: baseFixture,
        },
      }}
    />,
  );
  instance = wrapper.instance();
};

let pendingPromiseResolve;
const waitForPostMessage = () => new Promise(resolve => {
  pendingPromiseResolve = resolve;
});

const parentMessageListener = e => {
  pendingPromiseResolve(e.data);
};

beforeAll(() => {
  parent.addEventListener('message', parentMessageListener, false);
  init();
});

afterAll(() => {
  parent.removeEventListener('message', parentMessageListener);
});

test('renders nothing at first', () => {
  expect(wrapper.html()).toBe(null);
});

test('notifies parent frames on load', () =>
  waitForPostMessage().then(data => {
    expect(data).toEqual({ type: 'loaderReady' });
  }),
);

test('creates linked list from proxy list', () => {
  expect(mockGetLinkedList).toHaveBeenLastCalledWith([Proxy]);
});

describe('on `fixtureLoad` event', () => {
  let firstProxyWrapper;
  let firstProxyProps;
  let firstProxyKey;

  beforeAll(() => {
    window.postMessage({
      type: 'fixtureLoad',
      component: 'FooBar',
      fixture: 'base',
    }, '*');

    return waitForPostMessage().then(() => {
      firstProxyWrapper = wrapper.find(mockFirstProxy.value);
      firstProxyProps = firstProxyWrapper.props();
      firstProxyKey = firstProxyWrapper.key();
    });
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

  describe('on `fixtureChange` event', () => {
    const fixtureBody = {
      title: 'We are the robots',
    };

    beforeAll(() => {
      window.postMessage({
        type: 'fixtureChange',
        fixtureBody,
      }, '*');

      return waitForPostMessage().then(() => {
        firstProxyWrapper = wrapper.find(mockFirstProxy.value);
        firstProxyProps = firstProxyWrapper.props();
      });
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

  describe('on fixture update', () => {
    const updatedFixture = {
      title: 'We are the robots PART 2'
    };

    beforeAll(() => {
      const { onFixtureUpdate } = instance;
      onFixtureUpdate(updatedFixture);
    });

    test('includes body received in fixture sent to first proxy', () => {
      expect(firstProxyProps.fixture).toEqual({
        ...mockFixtureParts.unserializable,
        ...updatedFixture,
      });
    });

    test('publishes message to parent', () => {
      return waitForPostMessage().then(data => {
        expect(data).toEqual({
          type: 'fixtureUpdate',
          fixtureBody: updatedFixture,
        });
      });
    });
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('unsubscribes from message events', () => {
      instance.setState = jest.fn();

      window.postMessage({
        type: 'fixtureLoad',
        component: 'FooBarBar',
        fixture: 'base',
      }, '*');

      return waitForPostMessage().then(() => {
        expect(instance.setState).not.toHaveBeenCalled();
      });
    });
  });
});
