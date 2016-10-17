import React from 'react';
import { shallow } from 'enzyme';
import createStateProxy from '../StateProxy';

jest.mock('react-component-tree');

const ReactComponentTree = require('react-component-tree');

const NextProxy = () => {};
const nextProxyNext = {};
const nextProxy = {
  value: NextProxy,
  next: () => nextProxyNext,
};
const previewRef = jest.fn();

let fixture;
let previewComponent;
let stateMock;
let onFixtureUpdate;
let updatedFixture;
let StateProxy;
let wrapper;
let childWrapper;
let childProps;

jest.useFakeTimers();

const renderProxy = (f) => {
  fixture = f;
  previewComponent = f.state ? { state: f.state } : {};
  onFixtureUpdate = jest.fn(({ state }) => {
    updatedFixture = { ...fixture, state };
  });

  jest.clearAllMocks();

  StateProxy = createStateProxy({
    updateInterval: 1337,
  });
  wrapper = shallow(
    <StateProxy
      nextProxy={nextProxy}
      fixture={fixture}
      previewRef={previewRef}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
  childWrapper = wrapper.at(0);
  childProps = childWrapper.props();
  // Simulate renedering of preview component
  childProps.previewRef(previewComponent);
};

const commonTests = () => {
  test('renders next proxy in line', () => {
    expect(childWrapper.type()).toEqual(NextProxy);
  });

  test('sends nextProxy.next() to next proxy', () => {
    expect(childProps.nextProxy).toEqual(nextProxyNext);
  });

  test('sends fixture to next proxy', () => {
    expect(childProps.fixture).toEqual(fixture);
  });

  test('serializes preview component', () => {
    expect(ReactComponentTree.serialize.mock.calls[0][0]).toBe(previewComponent);
  });

  test('bubbles up preview ref', () => {
    expect(previewRef.mock.calls[0][0]).toBe(previewComponent);
  });
};

describe('fixture without state', () => {
  beforeAll(() => {
    renderProxy({});
  });

  commonTests();

  test('does not inject state', () => {
    expect(ReactComponentTree.injectState).not.toHaveBeenCalled();
  });

  test('does not call onFixtureUpdate', () => {
    expect(onFixtureUpdate.mock.calls.length).toBe(0);
  });

  test('does not start update interval', () => {
    expect(setTimeout.mock.calls.length).toBe(0);
  });
});

describe('fixture with state', () => {
  beforeAll(() => {
    stateMock = { counter: 6 };
    ReactComponentTree.__setStateMock(stateMock);

    renderProxy({
      state: {
        counter: 5,
      },
    });
  });

  commonTests();

  test('injects state', () => {
    const [component, state] = ReactComponentTree.injectState.mock.calls[0];
    expect(component).toBe(previewComponent);
    expect(state).toBe(fixture.state);
  });

  test('starts update interval', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
  });

  test('calls onFixtureUpdate once', () => {
    expect(onFixtureUpdate.mock.calls.length).toBe(1);
  });

  test('calls onFixtureUpdate with new state', () => {
    expect(onFixtureUpdate.mock.calls[0][0].state).toBe(stateMock);
  });

  test('schedules timeout', () => {
    expect(setTimeout.mock.calls.length).toBe(1);
  });

  test('schedules timeout with options.interval', () => {
    expect(setTimeout.mock.calls[0][1]).toBe(1337);
  });

  describe('after interval without state change passes', () => {
    beforeAll(() => {
      // Simulate one way data flow communication between proxies, fixtureUpdates
      // are returned as props
      wrapper.setProps({ fixture: updatedFixture });

      jest.runOnlyPendingTimers();
    });

    test('serializes preview component again', () => {
      expect(ReactComponentTree.serialize.mock.calls[1][0]).toBe(previewComponent);
    });

    test('does not onFixtureUpdate once again', () => {
      expect(onFixtureUpdate.mock.calls.length).toBe(1);
    });

    test('schedules another timeout', () => {
      expect(setTimeout.mock.calls.length).toBe(2);
    });
  });

  describe('after interval with state change passes', () => {
    beforeAll(() => {
      // Simulate one way data flow communication between proxies, fixtureUpdates
      // are returned as props
      wrapper.setProps({ fixture: updatedFixture });

      // Simulate state change inside preview component
      stateMock = { counter: 7 };
      ReactComponentTree.__setStateMock(stateMock);

      jest.runOnlyPendingTimers();
    });

    test('calls onFixtureUpdate once again', () => {
      expect(onFixtureUpdate.mock.calls.length).toBe(2);
    });

    test('serializes preview component again', () => {
      expect(ReactComponentTree.serialize.mock.calls[2][0]).toBe(previewComponent);
    });

    test('calls onFixtureUpdate with updated state', () => {
      expect(onFixtureUpdate.mock.calls[1][0].state.counter).toBe(7);
    });

    test('schedules another timeout', () => {
      expect(setTimeout.mock.calls.length).toBe(3);
    });
  });

  describe('on unmount', () => {
    beforeAll(() => {
      wrapper.unmount();
    });

    test('clears timeout', () => {
      expect(clearTimeout.mock.calls.length).toBe(1);
    });
  });
});
