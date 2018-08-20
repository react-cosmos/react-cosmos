// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../CaptureProps';
import { FixtureProvider } from '../FixtureProvider';

import type { ComponentMetadata } from '../types';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

it('renders with props', () => {
  expect(
    create(
      <FixtureProvider>
        <HelloMessage name="Satoshi" />
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  const { getInstance } = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  expect(getInstance().state.fixtureState).toEqual(
    expect.objectContaining({
      props: [
        {
          component: {
            instanceId: expect.any(Number),
            name: 'HelloMessage'
          },
          renderKey: expect.any(Number),
          values: [
            {
              serializable: true,
              key: 'name',
              value: 'Satoshi'
            }
          ]
        }
      ]
    })
  );
});

it('overwrites prop', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );
  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('clears prop', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );
  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithNoValues({ component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

it('reverts to original prop', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  const [{ component }] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );
  instance.update(
    <FixtureProvider fixtureState={{ props: [] }}>
      <HelloMessage name="Satoshi" />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

it('reuses instance on props with same renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  const { fixtureState } = instance.getInstance().state;
  const [{ component, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component, renderKey })]
      }}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  expect(ref1).not.toBeFalsy();
  expect(ref1).toBe(ref2);
});

it('creates new instance on props with different renderKey', () => {
  let ref1, ref2;

  const instance = create(
    <FixtureProvider>
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref1 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  const { fixtureState } = instance.getInstance().state;
  const [{ component, renderKey }] = fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({
            name: 'Vitalik',
            component,
            renderKey: renderKey + 1
          })
        ]
      }}
    >
      <HelloMessage
        name="Satoshi"
        ref={ref => {
          if (ref) {
            ref2 = ref;
          }
        }}
      />
    </FixtureProvider>
  );

  expect(ref1).not.toBeFalsy();
  expect(ref1).not.toBe(ref2);
});

it('captures props from multiple components (explicit capture)', () => {
  const { getInstance } = create(
    <FixtureProvider>
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </FixtureProvider>
  );

  expect(getInstance().state.fixtureState).toEqual(
    expect.objectContaining({
      props: [
        {
          component: {
            instanceId: expect.any(Number),
            name: 'HelloMessage'
          },
          renderKey: expect.any(Number),
          values: [
            {
              serializable: true,
              key: 'name',
              value: 'Satoshi'
            }
          ]
        },
        {
          component: {
            instanceId: expect.any(Number),
            name: 'HelloMessage'
          },
          renderKey: expect.any(Number),
          values: [
            {
              serializable: true,
              key: 'name',
              value: 'Vitalik'
            }
          ]
        }
      ]
    })
  );
});

it('captures props from multiple components (direct children)', () => {
  const { getInstance } = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  expect(getInstance().state.fixtureState).toEqual(
    expect.objectContaining({
      props: [
        {
          component: {
            instanceId: expect.any(Number),
            name: 'HelloMessage'
          },
          renderKey: expect.any(Number),
          values: [
            {
              serializable: true,
              key: 'name',
              value: 'Satoshi'
            }
          ]
        },
        {
          component: {
            instanceId: expect.any(Number),
            name: 'HelloMessage'
          },
          renderKey: expect.any(Number),
          values: [
            {
              serializable: true,
              key: 'name',
              value: 'Vitalik'
            }
          ]
        }
      ]
    })
  );
});

it('overwrites props in multiple components', () => {
  const instance = create(
    <FixtureProvider>
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  const [
    { component: component1 },
    { component: component2 }
  ] = instance.getInstance().state.fixtureState.props;

  instance.update(
    <FixtureProvider
      fixtureState={{
        props: [
          getPropsWithName({ name: 'SATOSHI', component: component1 }),
          getPropsWithName({ name: 'VITALIK', component: component2 })
        ]
      }}
    >
      <HelloMessage name="Satoshi" />
      <HelloMessage name="Vitalik" />
    </FixtureProvider>
  );

  expect(instance.toJSON()).toEqual(['Hello, SATOSHI!', 'Hello, VITALIK!']);
});

function getPropsWithName({
  component,
  name,
  renderKey = 0
}: {
  component: ComponentMetadata,
  name: string,
  renderKey?: number
}) {
  return {
    component,
    renderKey,
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}

function getPropsWithNoValues({ component }) {
  return {
    component,
    renderKey: 0,
    values: []
  };
}
