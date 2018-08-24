// @flow

import until from 'async-until';
import React, { Component, Fragment } from 'react';
import { create } from 'react-test-renderer';
import {
  updateFixtureState,
  getState,
  setState
} from '../../shared/fixtureState';
import { FixtureProvider } from '../../FixtureProvider';
import { ComponentState } from '../../ComponentState';

import type { ElementRef } from 'react';

it('uses initial state', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <ComponentState>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('0 times');
});

it('mocks state', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('5 times');
});

it('captures initial state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [state] = getState(fixtureState);
  expect(state).toEqual(getStateInstanceShape(0));
});

it('captures mocked state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [state] = getState(fixtureState);
  expect(state).toEqual(getStateInstanceShape(5));
});

it('overwrites initial state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, { count: 5 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');
});

it('overwrites mocked state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, { count: 100 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('100 times');
});

it('removes initial state property', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, {});

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('removes mocked state property', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, {});

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('reverts to initial state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, { count: 5 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  fixtureState = updateFixtureState({ state: [] });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 times');
});

it('reverts to mocked state', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [{ instanceId }] = getState(fixtureState);
  fixtureState = setState(fixtureState, instanceId, { count: 10 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('10 times');

  fixtureState = updateFixtureState(fixtureState, { state: [] });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  const [state] = getState(fixtureState);
  expect(state).toEqual(getStateInstanceShape(5));
});

it('captures component state changes', async () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  let counterRef: ?ElementRef<typeof Counter>;
  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <ComponentState>
        <Counter
          ref={elRef => {
            if (elRef) {
              counterRef = elRef;
            }
          }}
        />
      </ComponentState>
    </FixtureProvider>
  );

  await until(() => counterRef);
  if (!counterRef) {
    throw new Error('Counter ref missing');
  }

  counterRef.setState({ count: 7 });
  await until(() => getCountValue(fixtureState) === 7);

  counterRef.setState({ count: 13 });
  await until(() => getCountValue(fixtureState) === 13);
});

it('mocks state in multiple instances', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
        <ComponentState state={{ count: 10 }}>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toEqual(['5 times', '10 times']);
});

it('captures mocked state from multiple instances', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [state1, state2] = getState(fixtureState);
  expect(state1).toEqual(getStateInstanceShape(5));
  expect(state2).toEqual(getStateInstanceShape(10));
});

it('overwrites mocked state in multiple instances', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const fixture = (
    <Fragment>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </Fragment>
  );
  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  const [state1, state2] = getState(fixtureState);
  fixtureState = setState(fixtureState, state1.instanceId, { count: 50 });
  fixtureState = setState(fixtureState, state2.instanceId, { count: 100 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['50 times', '100 times']);
});

it('unmounts gracefully', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureStateWithCb(fixtureState, updater, cb);
  };

  const instance = create(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(() => {
    instance.unmount();
  }).not.toThrow();
});

// End of tests

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

const updateFixtureStateWithCb = (fixtureState, updater, cb) => {
  const nextFixtureState = updateFixtureState(fixtureState, updater);

  // Calling the set state callback after a state update is relevant in these
  // tests becaused ComponentState hooks into it for scheduling periodic state
  // change checks on the loaded component
  if (typeof cb === 'function') {
    cb();
  }

  return nextFixtureState;
};

function getStateInstanceShape(count) {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: count
      }
    ]
  };
}

function getCountValue(fixtureState) {
  const [{ values }] = getState(fixtureState);

  return values[0].value;
}
