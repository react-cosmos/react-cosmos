// @flow

import React, { Component } from 'react';
import { create as render } from 'react-test-renderer';
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
    render(
      <FixtureProvider>
        <Counter />
      </FixtureProvider>
    ).toJSON()
  ).toBe('0 times');
});

it('renders (explicit) mocked count', () => {
  expect(
    render(
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
    render(
      <FixtureProvider>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toBe('5 times');
});

// TODO: ComponentState without state
