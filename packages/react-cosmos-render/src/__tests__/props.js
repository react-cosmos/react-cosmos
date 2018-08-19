// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { Fixture } from '../Fixture';

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
  const onUpdate = jest.fn();
  create(
    <Fixture onUpdate={onUpdate}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  expect(onUpdate).toBeCalledWith(
    expect.objectContaining({
      props: [
        {
          component: {
            id: expect.any(Number),
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
  expect(
    create(
      <Fixture
        fixtureState={{
          props: [
            {
              component: { id: 1, name: 'Test' },
              values: [
                {
                  serializable: true,
                  key: 'name',
                  value: 'Vitalik'
                }
              ]
            }
          ]
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Vitalik!');
});

it('clears props', () => {
  expect(
    create(
      <Fixture
        fixtureState={{
          props: [
            {
              component: { id: 1, name: 'Test' },
              values: []
            }
          ]
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Guest!');
});

it('overwrites prop again on update', () => {
  function getPropsWithName(name) {
    return [
      {
        component: { id: 1, name: 'Test' },
        values: [
          {
            serializable: true,
            key: 'name',
            value: name
          }
        ]
      }
    ];
  }

  const instance = create(
    <Fixture
      fixtureState={{
        props: getPropsWithName('Vitalik')
      }}
    >
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  instance.update(
    <Fixture
      fixtureState={{
        props: getPropsWithName('Elon')
      }}
    >
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  expect(instance.toJSON()).toBe('Hello, Elon!');
});

// TODO: fixtureState change

// TODO: fixtureState change to null

// TODO: fixtureState change creates new instance (new key)

// TODO: fixtureState change transitions props (reuse key)

// TODO: captures props from multiple components
