// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { Fixture } from '../Fixture';
import { ComponentState } from '../ComponentState';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

it('renders fixture with initial count', () => {
  expect(
    render(
      <Fixture>
        <Counter />
      </Fixture>
    )
  ).toBe('0 times');
});

it('renders fixture with (explicit) mocked count', () => {
  expect(
    render(
      <Fixture>
        <ComponentState state={{ count: 5 }}>
          {ref => <Counter ref={ref} />}
        </ComponentState>
      </Fixture>
    )
  ).toBe('5 times');
});

it('renders fixture with (implicit) mocked count', () => {
  expect(
    render(
      <Fixture>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
      </Fixture>
    )
  ).toBe('5 times');
});

// TODO: ComponentState without state

function render(node) {
  return create(node).toJSON();
}
