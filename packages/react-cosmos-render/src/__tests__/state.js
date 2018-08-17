// @flow

import React, { Component } from 'react';
import { ComponentState } from '../ComponentState';
import { render } from './_shared';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

it('renders fixture with initial count', () => {
  expect(render(<Counter />)).toBe('0 times');
});

it('renders fixture with mocked count', () => {
  expect(
    render(
      <ComponentState state={{ count: 5 }}>
        {ref => <Counter ref={ref} />}
      </ComponentState>
    )
  ).toBe('5 times');
});

it('renders fixture with (implicit) mocked count', () => {
  expect(
    render(
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    )
  ).toBe('5 times');
});

// TODO: Test ComponentState without state
