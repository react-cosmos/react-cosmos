// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { ComponentState } from '../ComponentState';
import { FixtureProvider } from '../FixtureProvider';
import {
  updateFixtureState,
  setProps,
  resetProps,
  getState,
  setState
} from './_shared';

it('resets state when resetting props', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setState(fixtureState, { count: 5 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  fixtureState = resetProps(fixtureState, { suffix: 'timez' });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 timez');

  const [state2] = getState(fixtureState);
  expect(state2.values).toEqual([
    {
      serializable: true,
      key: 'count',
      value: 0
    }
  ]);
});

it('keeps state when transitioning props', () => {
  let fixtureState = {};
  const setFixtureState = (updater, cb) => {
    fixtureState = updateFixtureState(fixtureState, updater, cb);
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

  fixtureState = setState(fixtureState, { count: 5 });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  fixtureState = setProps(fixtureState, { suffix: 'timez' });

  instance.update(
    <FixtureProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 timez');

  const [state2] = getState(fixtureState);
  expect(state2.values).toEqual([
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
