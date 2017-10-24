import React from 'react';
import { shallow } from 'enzyme';
import createStateProxy from '../';

// Vars populated in beforeEach blocks
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let setState;
let componentRef;
let onComponentRef;
let onFixtureUpdate;
let StateProxy;
let wrapper;
let props;

describe('React state proxy – disabled', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    // Objects to check identity against
    NextProxy = () => {};
    nextProxyNext = {};
    nextProxy = {
      value: NextProxy,
      next: () => nextProxyNext
    };
    Component = () => {};
    setState = jest.fn((state, cb) => {
      cb();
    });
    componentRef = {
      setState
    };
    onComponentRef = jest.fn();
    onFixtureUpdate = jest.fn();

    StateProxy = createStateProxy({
      updateInterval: 1337
    });

    return new Promise(resolve => {
      wrapper = shallow(
        <StateProxy
          nextProxy={nextProxy}
          fixture={{
            component: Component,
            foo: 'bar',
            state: {
              baz: 'qux'
            }
          }}
          onComponentRef={ref => {
            onComponentRef(ref);
            resolve();
          }}
          onFixtureUpdate={onFixtureUpdate}
          disableLocalState
        />
      );

      // These are the props of the next proxy
      props = wrapper.props();

      // Simulate rendering
      props.onComponentRef(componentRef);
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('renders next proxy in line', () => {
    expect(wrapper.type()).toBe(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(props.nextProxy).toBe(nextProxyNext);
  });

  test('sends fixture to next proxy', () => {
    expect(props.fixture).toEqual({
      component: Component,
      foo: 'bar',
      state: {
        baz: 'qux'
      }
    });
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    expect(props.onFixtureUpdate).toBe(onFixtureUpdate);
  });

  test('oes not inject state', () => {
    expect(setState).not.toHaveBeenCalled();
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('does not start update interval', () => {
    expect(setTimeout).toHaveBeenCalledTimes(0);
  });
});
