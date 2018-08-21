// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { ComponentState } from '../ComponentState';
import { FixtureProvider } from '../FixtureProvider';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

it('resets state when resetting props', () => {
  const countValue = {
    serializable: true,
    key: 'count',
    value: 5
  };

  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const { fixtureState } = instance.getInstance().state;
  const [props] = fixtureState.props;
  const [state] = fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [
          {
            component: state.component,
            values: [countValue]
          }
        ]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          {
            component: props.component,
            // This is resetting the component instance
            renderKey: props.renderKey + 1,
            values: []
          }
        ],
        state: [
          {
            component: state.component,
            values: [countValue]
          }
        ]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 times');

  const [state2] = instance.getInstance().state.fixtureState.state;
  expect(state2.values).toEqual([
    {
      serializable: true,
      key: 'count',
      value: 0
    }
  ]);
});
