// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { ComponentState } from '../../ComponentState';
import { FixtureProvider } from '../../FixtureProvider';
import {
  updateState,
  getFixtureStateProps,
  setFixtureStateProps,
  resetFixtureStateProps,
  getFixtureStateState,
  setFixtureStateState
} from 'react-cosmos-shared2';

it('resets state when resetting props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const fixture = (
    <ComponentState>
      <Counter suffix="times" />
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

  const [{ instanceId: stateInstanceId }] = getFixtureStateState(fixtureState);
  fixtureState = setFixtureStateState(fixtureState, stateInstanceId, {
    count: 5
  });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  const [{ instanceId: propsInstanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = resetFixtureStateProps(fixtureState, propsInstanceId, {
    suffix: 'timez'
  });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 timez');

  const [{ values }] = getFixtureStateState(fixtureState);
  expect(values).toEqual([
    {
      serializable: true,
      key: 'count',
      value: 0
    }
  ]);
});

it('keeps state when transitioning props', () => {
  let fixtureState = {};
  const setFixtureState = updater => {
    fixtureState = updateState(fixtureState, updater);
  };

  const fixture = (
    <ComponentState>
      <Counter suffix="times" />
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

  const [{ instanceId: stateInstanceId }] = getFixtureStateState(fixtureState);
  fixtureState = setFixtureStateState(fixtureState, stateInstanceId, {
    count: 5
  });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  const [{ instanceId: propsInstanceId }] = getFixtureStateProps(fixtureState);
  fixtureState = setFixtureStateProps(fixtureState, propsInstanceId, {
    suffix: 'timez'
  });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 timez');

  const [{ values }] = getFixtureStateState(fixtureState);
  expect(values).toEqual([
    {
      serializable: true,
      key: 'count',
      value: 5
    }
  ]);
});

// End of tests

class Counter extends Component<{ suffix: string }, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} ${this.props.suffix}`;
  }
}
