import React from 'react';
import { shallow } from 'enzyme';
import createStateProxy from '..';

// Vars populated in beforeEach blocks
let NextProxy;
let nextProxyNext;
let nextProxy;
let Component;
let setState;
let setStateChild1;
let setStateChild2;
let componentRef;
let onComponentRef;
let onFixtureUpdate;
let StateProxy;
let wrapper;
let props;

describe('React state proxy – fixture state nested', () => {
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
    setState = jest.fn((state, cb) => cb());
    setStateChild1 = jest.fn((state, cb) => cb());
    setStateChild2 = jest.fn((state, cb) => cb());
    componentRef = {
      setState,
      refs: {
        child1: {
          setState: setStateChild1
        },
        child2: {
          setState: setStateChild2
        }
      }
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
              baz: 'qux',
              children: {
                child1: {
                  qux: 'quuz'
                },
                child2: {
                  corge: 'grault'
                }
              }
            }
          }}
          onComponentRef={ref => {
            onComponentRef(ref);
            resolve();
          }}
          onFixtureUpdate={onFixtureUpdate}
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
        baz: 'qux',
        children: {
          child1: {
            qux: 'quuz'
          },
          child2: {
            corge: 'grault'
          }
        }
      }
    });
  });

  test('bubbles up component ref', () => {
    expect(onComponentRef.mock.calls[0][0]).toBe(componentRef);
  });

  test('bubbles up fixture updates', () => {
    expect(props.onFixtureUpdate).toBe(onFixtureUpdate);
  });

  test('injects state', () => {
    expect(setState).toHaveBeenLastCalledWith(
      {
        baz: 'qux'
      },
      expect.any(Function)
    );
  });

  test('injects state in first child', () => {
    expect(setStateChild1).toHaveBeenLastCalledWith(
      {
        qux: 'quuz'
      },
      expect.any(Function)
    );
  });

  test('injects state in second child', () => {
    expect(setStateChild2).toHaveBeenLastCalledWith(
      {
        corge: 'grault'
      },
      expect.any(Function)
    );
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate).not.toHaveBeenCalled();
  });

  test('starts update interval once', () => {
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('starts update interval with handler and time', () => {
    expect(setTimeout).toHaveBeenLastCalledWith(
      wrapper.instance().onStateUpdate,
      1337
    );
  });
});
