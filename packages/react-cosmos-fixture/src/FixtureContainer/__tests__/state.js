// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { StateMock } from '@react-mock/state';
import { FixtureContainer } from '../../FixtureContainer';

it('renders initial state', () => {
  expect(
    create(
      <FixtureContainer>
        <Counter />
      </FixtureContainer>
    ).toJSON()
  ).toBe('0 times');
});

it('renders mocked state', () => {
  expect(
    create(
      <FixtureContainer>
        <StateMock state={{ count: 5 }}>
          <Counter />
        </StateMock>
      </FixtureContainer>
    ).toJSON()
  ).toBe('5 times');
});

it('renders multiple mocked states', () => {
  expect(
    create(
      <FixtureContainer>
        <StateMock state={{ count: 5 }}>
          <Counter />
        </StateMock>
        <StateMock state={{ count: 10 }}>
          <Counter />
        </StateMock>
      </FixtureContainer>
    ).toJSON()
  ).toEqual(['5 times', '10 times']);
});

it('unmounts gracefully', () => {
  const renderer = create(
    <FixtureContainer>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
    </FixtureContainer>
  );

  expect(() => {
    renderer.unmount();
  }).not.toThrow();
});

it('renders replaced component type', () => {
  const renderer = create(
    <FixtureContainer>
      <StateMock>
        <Counter />
      </StateMock>
    </FixtureContainer>
  );

  renderer.update(
    <FixtureContainer>
      <StateMock>
        <CoolCounter />
      </StateMock>
    </FixtureContainer>
  );

  expect(renderer.toJSON()).toBe('0 timez');
});

it('overwrites initial state', () => {
  const renderer = create(
    <FixtureContainer>
      <StateMock state={{}}>
        <Counter />
      </StateMock>
    </FixtureContainer>
  );

  expect(renderer.toJSON()).toBe('undefined times');
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
