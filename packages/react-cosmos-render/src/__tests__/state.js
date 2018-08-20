// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../FixtureProvider';
import { ComponentState } from '../ComponentState';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

it('renders initial count', () => {
  expect(
    create(
      <FixtureProvider>
        <ComponentState>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('0 times');
});

it('renders (explicit) mocked count', () => {
  expect(
    create(
      <FixtureProvider>
        <ComponentState state={{ count: 5 }}>
          {ref => <Counter ref={ref} />}
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('5 times');
});

it('renders (implicit) mocked count', () => {
  expect(
    create(
      <FixtureProvider>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('5 times');
});

it('captures initial state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  // [state]
  const state = instance.getInstance().state.fixtureState.state;
  expect(state).toEqual([
    {
      serializable: true,
      key: 'count',
      value: 0
    }
  ]);
  // expect(state).toEqual({
  //   component: {
  //     instanceId: expect.any(Number),
  //     name: 'HelloMessage'
  //   },
  //   renderKey: expect.any(Number),
  //   values: [
  //     {
  //       serializable: true,
  //       key: 'count',
  //       value: 0
  //     }
  //   ]
  // });
});
