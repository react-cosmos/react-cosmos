// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { Fixture } from '../Fixture';
import { CaptureProps } from '../CaptureProps';
import { StatefulFixture } from './_shared';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

it('renders with props', () => {
  expect(
    create(
      <Fixture>
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  const { getInstance } = create(
    <StatefulFixture>
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );

  expect(getInstance().state).toEqual(
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
    <StatefulFixture>
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );
  const { state } = instance.getInstance();
  const { component } = state.props[0];

  instance.update(
    <StatefulFixture
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );

  expect(instance.toJSON()).toBe('Hello, Vitalik!');
});

it('clears prop', () => {
  const instance = create(
    <StatefulFixture>
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );
  const { state } = instance.getInstance();
  const { component } = state.props[0];

  instance.update(
    <StatefulFixture
      fixtureState={{
        props: [getPropsWithNoValues({ component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

it('reverts to original prop', () => {
  const instance = create(
    <StatefulFixture>
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );
  const { state } = instance.getInstance();
  const { component } = state.props[0];

  instance.update(
    <StatefulFixture
      fixtureState={{
        props: [getPropsWithName({ name: 'Vitalik', component })]
      }}
    >
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );
  instance.update(
    <StatefulFixture fixtureState={{ props: [] }}>
      <HelloMessage name="Satoshi" />
    </StatefulFixture>
  );

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

// TODO: fixtureState change creates new instance (new key)

// TODO: fixtureState change transitions props (reuse key)

it('captures props from multiple components (explicit capture)', () => {
  const { getInstance } = create(
    <StatefulFixture>
      <CaptureProps>
        <HelloMessage name="Satoshi" />
      </CaptureProps>
      <CaptureProps>
        <HelloMessage name="Vitalik" />
      </CaptureProps>
    </StatefulFixture>
  );

  expect(getInstance().state).toEqual(
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
