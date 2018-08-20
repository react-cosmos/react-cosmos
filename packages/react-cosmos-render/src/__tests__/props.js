// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { CaptureProps } from '../CaptureProps';
import { FixtureProvider } from '../FixtureProvider';

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

// TODO: fixtureState change creates new instance (new key)

// TODO: fixtureState change transitions props (reuse key)

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

// TODO: captures props from multiple components (direct children)

// TODO: overwrites props in multiple components

function getPropsWithName({ component, name }) {
  return {
    component,
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
    values: []
  };
}
