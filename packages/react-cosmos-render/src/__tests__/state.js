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
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

it('uses initial state', () => {
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

it('mocks state', () => {
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
    values: [
      {
        serializable: true,
        key: 'count',
        value: 0
      }
    ]
  });
});

it('captures mocked state', () => {
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
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('100 times');
});

it('removes state property', () => {
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
        state: [getEmptyState({ component })]
      }}
    >
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('removes initial state property', () => {
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
        state: [getEmptyState({ component })]
      }}
    >
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('reverts to initial state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: []
      }}
    >
      <ComponentState>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 times');
});

it('reverts to mocked state', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: []
      }}
    >
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('10 times');
});

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

it('mocks state in multiple instances', () => {
  expect(
    create(
      <FixtureProvider>
        <ComponentState state={{ count: 5 }}>
          <Counter />
        </ComponentState>
        <ComponentState state={{ count: 10 }}>
          <Counter />
        </ComponentState>
      </FixtureProvider>
    ).toJSON()
  ).toEqual(['5 times', '10 times']);
});

it('captures mocked state from multiple instances', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [state1, state2] = instance.getInstance().state.fixtureState.state;
  expect(state1).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'Counter'
    },
    values: [
      {
        serializable: true,
        key: 'count',
        value: 5
      }
    ]
  });
  expect(state2).toEqual({
    component: {
      instanceId: expect.any(Number),
      name: 'Counter'
    },
    values: [
      {
        serializable: true,
        key: 'count',
        value: 10
      }
    ]
  });
});

it('overwrites mocked state in multiple instances', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  const [
    { component: component1 },
    { component: component2 }
  ] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [
          getStateWithCount({ count: 50, component: component1 }),
          getStateWithCount({ count: 100, component: component2 })
        ]
      }}
    >
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['50 times', '100 times']);
});

it('unmounts gracefully', () => {
  const instance = create(
    <FixtureProvider>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
    </FixtureProvider>
  );

  expect(() => {
    instance.unmount();
  }).not.toThrow();
});

function getStateWithCount({
  component,
  count
}: {
  component: ComponentMetadata,
  count: number
}) {
  return {
    component,
    values: [
      {
        serializable: true,
        key: 'count',
        value: count
      }
    ]
  };
}

function getEmptyState({ component }) {
  return {
    component,
    values: []
  };
}

function getCountValueFromTestInstance(instance) {
  const [{ values }] = instance.getInstance().state.fixtureState.state;

  return values.find(v => v.key === 'count').value;
}
