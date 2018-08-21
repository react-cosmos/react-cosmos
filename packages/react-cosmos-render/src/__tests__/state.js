// @flow

import until from 'async-until';
import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../FixtureProvider';
import { ComponentState } from '../ComponentState';

import type { ElementRef } from 'react';
import type { ComponentMetadata } from '../types';

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

it('renders mocked count', () => {
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

  const [state] = instance.getInstance().state.fixtureState.state;
  expect(state).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'Counter'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'count',
        value: 0
      }
    ]
  });
});

it('captures defined state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [state] = instance.getInstance().state.fixtureState.state;
  expect(state).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'Counter'
    },
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'count',
        value: 5
      }
    ]
  });
});

it('overwrites initial state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [{ component }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 5, component })]
      }}
    >
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');
});

it('overwrites mocked state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [{ component }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 100, component })]
      }}
    >
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('100 times');
});

// TODO: renderKey

it('captures component state changes', async () => {
  let counterRef: ?ElementRef<typeof Counter>;

  const instance = create(
    <FixtureProvider>
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
  await until(() => getCountValueFromTestInstance(instance) === 7);

  counterRef.setState({ count: 13 });
  await until(() => getCountValueFromTestInstance(instance) === 13);

  expect(getCountValueFromTestInstance(instance)).toBe(13);
});

function getStateWithCount({
  component,
  count,
  renderKey = 0
}: {
  component: ComponentMetadata,
  count: number,
  renderKey?: number
}) {
  return {
    component,
    renderKey,
    values: [
      {
        serializable: true,
        key: 'count',
        value: count
      }
    ]
  };
}

function getCountValueFromTestInstance(instance) {
  const [{ values }] = instance.getInstance().state.fixtureState.state;

  return values.find(v => v.key === 'count').value;
}
