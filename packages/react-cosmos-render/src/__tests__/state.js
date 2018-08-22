// @flow

import until from 'async-until';
import React, { Component, Fragment } from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../FixtureProvider';
import { ComponentState } from '../ComponentState';

import type { ElementRef } from 'react';

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
    instanceId: expect.any(Number),
    componentName: 'Counter',
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
    instanceId: expect.any(Number),
    componentName: 'Counter',
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
  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 5, instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');
});

it('overwrites mocked state', () => {
  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 100, instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('100 times');
});

it('removes initial state property', () => {
  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getEmptyState({ instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('removes mocked state property', () => {
  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getEmptyState({ instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Missing count');
});

it('reverts to initial state', () => {
  const fixture = (
    <ComponentState>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;
  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 5, instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: []
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('0 times');

  const [state] = instance.getInstance().state.fixtureState.state;
  expect(state).toEqual({
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: 0
      }
    ]
  });
});

it('reverts to mocked state', () => {
  const fixture = (
    <ComponentState state={{ count: 5 }}>
      <Counter />
    </ComponentState>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [{ instanceId }] = instance.getInstance().state.fixtureState.state;
  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [getStateWithCount({ count: 10, instanceId })]
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: []
      }}
    >
      {fixture}
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('5 times');

  const [state] = instance.getInstance().state.fixtureState.state;
  expect(state).toEqual({
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: 5
      }
    ]
  });
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
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: 5
      }
    ]
  });
  expect(state2).toEqual({
    instanceId: expect.any(Number),
    componentName: 'Counter',
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
  const fixture = (
    <Fragment>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </Fragment>
  );
  const instance = create(<FixtureProvider>{fixture}</FixtureProvider>);

  const [
    { instanceId: instanceId1 },
    { instanceId: instanceId2 }
  ] = instance.getInstance().state.fixtureState.state;

  instance.update(
    <FixtureProvider
      fixtureState={{
        state: [
          getStateWithCount({ count: 50, instanceId: instanceId1 }),
          getStateWithCount({ count: 100, instanceId: instanceId2 })
        ]
      }}
    >
      {fixture}
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
  instanceId,
  count
}: {
  instanceId: number,
  count: number
}) {
  return {
    instanceId,
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        value: count
      }
    ]
  };
}

function getEmptyState({ instanceId }) {
  return {
    instanceId,
    componentName: 'Counter',
    values: []
  };
}

function getCountValueFromTestInstance(instance) {
  const [{ values }] = instance.getInstance().state.fixtureState.state;

  return values.find(v => v.key === 'count').value;
}
