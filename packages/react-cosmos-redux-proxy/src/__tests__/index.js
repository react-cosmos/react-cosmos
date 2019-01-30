jest.mock('redux');

import React from 'react';
import { shallow } from 'enzyme';
import { createStore } from 'redux';
import { createReduxProxy } from '..';

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext
};
const onComponentRef = jest.fn();
const onFixtureUpdate = jest.fn();

let fixture;
let componentRef;
let ReduxProxy;
let wrapper;
let childWrapper;
let childProps;

const renderProxy = (f, options) => {
  fixture = f;
  componentRef = {};
  jest.clearAllMocks();
  createStore.mockReturnValue({
    store: { subscribe: jest.fn() }
  });
  ReduxProxy = createReduxProxy({
    ...options
  });
  wrapper = shallow(
    <ReduxProxy
      nextProxy={nextProxy}
      fixture={fixture}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.find('NextProxy').props();
  // Simulate rendering
  if (childProps.onComponentRef !== undefined) {
    childProps.onComponentRef(componentRef);
  }
};

const commonTests = () => {
  test('renders next proxy in line', () => {
    expect(wrapper.find('NextProxy').exists()).toBe(true);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(wrapper.find('NextProxy').props()).toHaveProperty(
      'nextProxy',
      nextProxyNext
    );
  });

  test('sends fixture props to next proxy', () => {
    expect(wrapper.find('NextProxy').props().fixture).toHaveProperty(
      'foo',
      'bar'
    );
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    childProps.onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });
};

describe('fixture without Redux state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar'
    });
  });

  commonTests();

  test('does not create Redux store', () => {
    expect(createStore).not.toHaveBeenCalled();
  });

  test('does not render provider', () => {
    expect(wrapper.find('Provider').exists()).toBe(false);
  });
});

describe('fixture with Redux state', () => {
  beforeAll(() => {
    renderProxy({
      foo: 'bar',
      reduxState: {
        counter: 6
      }
    });
  });

  commonTests();

  test('omits reduxState from fixture props sent to next proxy', () => {
    expect(wrapper.find('NextProxy').props().fixture.reduxState).toBe(
      undefined
    );
  });

  test('creates Redux store', () => {
    expect(createStore).toHaveBeenCalled();
  });

  test('passes initial state from reduxState to store', () => {
    expect(createStore.mock.calls[0][1]).toEqual({ counter: 6 });
  });

  test('renders the Provider', () => {
    expect(wrapper.find('Provider').exists()).toBe(true);
  });

  describe('on receiving new props', () => {
    beforeAll(() => {
      wrapper.setProps({
        fixture: {
          reduxState: {
            counter: 11
          }
        }
      });
    });

    it('creates a new store with updated state', () => {
      expect(createStore.mock.calls.length).toBe(2);
    });
  });
});
