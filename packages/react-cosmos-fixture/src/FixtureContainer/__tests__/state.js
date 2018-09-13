// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { ComponentState } from '../../ComponentState';
import { FixtureContainer } from '../../FixtureContainer';

it('renders initial state', () => {
  expect(
    create(
      <FixtureContainer>
        <ComponentState>
          <Counter />
        </ComponentState>
      </FixtureContainer>
    ).toJSON()
  ).toBe('0 times');
});

it('renders mocked state', () => {
  expect(
    create(
      <FixtureContainer>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
      </FixtureContainer>
    ).toJSON()
  ).toBe('5 times');
});

it('renders multiple mocked states', () => {
  expect(
    create(
      <FixtureContainer>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
        <ComponentState state={{ count: 10 }}>
          <Counter />
        </ComponentState>
      </FixtureContainer>
    ).toJSON()
  ).toEqual(['5 times', '10 times']);
});

it('unmounts gracefully', () => {
  const instance = create(
    <FixtureContainer>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureContainer>
  );

  expect(() => {
    instance.unmount();
  }).not.toThrow();
});

it('renders replaced component type', () => {
  const instance = create(
    <FixtureContainer>
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureContainer>
  );

  instance.update(
    <FixtureContainer>
      <ComponentState>
        <CoolCounter />
      </ComponentState>
    </FixtureContainer>
  );

  expect(instance.toJSON()).toBe('0 timez');
});

it('overwrites initial state', () => {
  const instance = create(
    <FixtureContainer>
      <ComponentState state={{}}>
        <Counter />
      </ComponentState>
    </FixtureContainer>
  );

  expect(instance.toJSON()).toBe('undefined times');
});

// End of tests

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

class CoolCounter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} timez`;
  }
}
