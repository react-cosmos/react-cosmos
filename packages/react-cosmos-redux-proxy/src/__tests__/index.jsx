import React from 'react';
import { shallow } from 'enzyme';
import createReduxProxy from '../index';

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext,
};
const onComponentRef = jest.fn();
const onFixtureUpdate = jest.fn();

let fixture;
let componentRef;
let storeUnsubscribeMock;
let storeMock;
let storeHandler;
let storeState;
let createStore;
let ReduxProxy;
let wrapper;
let childWrapper;
let childProps;

const renderProxy = (f, options) => {
  fixture = f;
  componentRef = {};

  jest.clearAllMocks();

  storeUnsubscribeMock = jest.fn();
  storeMock = {
    subscribe: jest.fn((handler) => {
      storeHandler = handler;
      return storeUnsubscribeMock;
    }),
    getState: () => storeState,
  };
  createStore = jest.fn(() => storeMock);
  ReduxProxy = createReduxProxy({
    ...options,
    createStore,
  });
  wrapper = shallow(
    <ReduxProxy
      nextProxy={nextProxy}
      component={() => {}}
      fixture={fixture}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
  // Simulate rendering
  childProps.onComponentRef(componentRef);
};

const commonTests = () => {
  test('renders next proxy in line', () => {
    expect(childWrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(childProps.nextProxy).toBe(nextProxyNext);
  });

  test('sends fixture props to next proxy', () => {
    expect(childProps.fixture.foo).toEqual('bar');
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    childProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls.length).toBe(1);
  });
};

describe('fixture without Redux state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
    });
  });

  commonTests();

  test('does not create Redux store', () => {
    expect(createStore).not.toHaveBeenCalled();
  });

  test('does not disable local state', () => {
    expect(childProps.disableLocalState).toBe(false);
  });
});

describe('fixture without Redux state with alwaysCreateStore', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
    }, {
      alwaysCreateStore: true,
    });
  });

  commonTests();

  test('creates Redux store', () => {
    expect(createStore).toHaveBeenCalled();
  });
});

describe('fixture with Redux state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
      reduxState: {
        counter: 6,
      },
    });
  });

  commonTests();

  test('omits reduxState from fixture props sent to next proxy', () => {
    expect(childProps.reduxState).toBe(undefined);
  });

  test('creates Redux store', () => {
    expect(createStore).toHaveBeenCalled();
  });

  test('puts Redux store instance in context', () => {
    expect(wrapper.instance().getChildContext().store).toBe(storeMock);
  });

  test('subscribes to Redux store', () => {
    expect(storeMock.subscribe).toHaveBeenCalled();
  });

  test('sends fixture update on Redux store change', () => {
    storeState = {
      counter: 10,
    };
    storeHandler();
    expect(onFixtureUpdate.mock.calls[1][0]).toEqual({
      reduxState: {
        counter: 10,
      },
    });
  });

  test('disables local state', () => {
    expect(childProps.disableLocalState).toBe(true);
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('unsubscribes from store changes', () => {
      expect(storeUnsubscribeMock).toHaveBeenCalled();
    });
  });
});

describe('fixture with Redux state and enabled local state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
      reduxState: {
        counter: 6,
      },
    }, {
      disableLocalState: false,
    });
  });

  commonTests();

  test('does not disable local state', () => {
    expect(childProps.disableLocalState).toBe(false);
  });
});
