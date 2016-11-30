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

const fakeProxyNext = {};
const fakeFirstProxy = {
  value: () => <span />,
  next: () => fakeProxyNext,
};
const getLinkedList = jest.fn(() => fakeFirstProxy);
jest.mock('react-cosmos-utils/lib/linked-list', () => getLinkedList);


const fakeFixtureParts = {
  unserializable: {
    onClick: jest.fn(),
  },
  serializable: {
    title: 'Lorem ipsum',
  },
};
const splitUnserializableParts = jest.fn(() => fakeFixtureParts);
jest.mock('react-cosmos-utils/lib/unserializable-parts', () => splitUnserializableParts);

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
    />
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
  expect(getLinkedList).toHaveBeenLastCalledWith([Proxy]);
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
    firstProxyWrapper = wrapper.find(fakeFirstProxy.value);
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
    expect(firstProxyProps.nextProxy).toBe(fakeProxyNext);
  });

  test('sends component to first proxy ', () => {
    expect(firstProxyProps.component).toBe(FooBarComponent);
  });

  test('splits unserializable parts from fixture', () => {
    expect(splitUnserializableParts).toHaveBeenLastCalledWith(baseFixture);
  });

  test('sends merged fixture parts to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual({
      ...fakeFixtureParts.unserializable,
      ...fakeFixtureParts.serializable,
    });
  });

  test('sends onFixtureUpdate cb to first proxy ', () => {
    expect(firstProxyProps.onFixtureUpdate).toBe(instance.onFixtureUpdate);
  });

  describe('on `fixtureChange` event', () => {
    beforeAll(() => {
      const { onMessage } = instance;
      onMessage({
        data: {
          type: 'fixtureChange',
          fixtureBody: {
            title: 'Dolor sit',
          },
        },
      });
      firstProxyWrapper = wrapper.find(fakeFirstProxy.value);
      firstProxyProps = firstProxyWrapper.props();
    });

    test('keeps unserializable fixture part', () => {
      expect(firstProxyProps.fixture.onClick).toBe(fakeFixtureParts.unserializable.onClick);
    });

    test('replaces serializable fixture part', () => {
      expect(firstProxyProps.fixture.title).toBe('Dolor sit');
    });

    test('changes element key', () => {
      expect(firstProxyWrapper.key()).not.toEqual(firstProxyKey);
    });
  });
});

describe('on `fixtureLoad` event with fixture body', () => {
  const fixtureBody = {
    title: 'We are the robots',
  };
  let firstProxyWrapper;
  let firstProxyProps;

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
    firstProxyWrapper = wrapper.find(fakeFirstProxy.value);
    firstProxyProps = firstProxyWrapper.props();
  });

  test('includes body received in fixture sent to first proxy', () => {
    expect(firstProxyProps.fixture).toEqual({
      ...fakeFixtureParts.unserializable,
      ...fixtureBody,
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
