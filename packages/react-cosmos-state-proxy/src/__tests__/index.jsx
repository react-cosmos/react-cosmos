import React from 'react';
import { shallow } from 'enzyme';
import createReactCosmosStateProxy from '../index';

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
let ReactCosmosStateProxy;
let wrapper;
let childWrapper;
let childProps;

jest.useFakeTimers();

const renderProxy = (f) => {
  fixture = f;
  previewComponent = {
    state: f.state ? { ...f.state } : undefined,
  };
  onFixtureUpdate = jest.fn(() => {});

  jest.clearAllMocks();

  ReactCosmosStateProxy = createReactCosmosStateProxy({
    updateInterval: 1337,
  });
  wrapper = shallow(
    <ReactCosmosStateProxy
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

  test('starts update interval with options.interval', () => {
    expect(setTimeout.mock.calls[0][1]).toBe(1337);
  });

  describe('after interval passes', () => {
    beforeAll(() => {
      stateMock = { counter: 7 };
      ReactComponentTree.__setStateMock(stateMock);

      jest.runOnlyPendingTimers();
    });

    test('calls onFixtureUpdate once again', () => {
      expect(onFixtureUpdate.mock.calls.length).toBe(2);
    });

    test('calls onFixtureUpdate with updated state', () => {
      expect(onFixtureUpdate.mock.calls[1][0].state.counter).toBe(7);
    });

    test('clears timeout on unmount', () => {
      wrapper.unmount();
      expect(clearTimeout.mock.calls.length).toBe(1);
    });
  });
});
