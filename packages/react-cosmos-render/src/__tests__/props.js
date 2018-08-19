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
          props: getPropsWithName('Vitalik')
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Vitalik!');
});

it('clears prop', () => {
  expect(
    create(
      <Fixture
        fixtureState={{
          props: getPropsWithNoValues()
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Guest!');
});

it('overwrites prop on update', () => {
  const MyFixture = ({ props }) => (
    <Fixture fixtureState={{ props }}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  const instance = create(<MyFixture props={getPropsWithName('Vitalik')} />);
  instance.update(<MyFixture props={getPropsWithName('Elon')} />);

  expect(instance.toJSON()).toBe('Hello, Elon!');
});

it('clears prop on update', () => {
  const MyFixture = ({ props }) => (
    <Fixture fixtureState={{ props }}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  const instance = create(<MyFixture props={getPropsWithName('Vitalik')} />);
  instance.update(<MyFixture props={getPropsWithNoValues()} />);

  expect(instance.toJSON()).toBe('Hello, Guest!');
});

it('reverts to original prop on update', () => {
  const MyFixture = ({ props }) => (
    <Fixture fixtureState={{ props }}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  const instance = create(<MyFixture props={getPropsWithName('Vitalik')} />);
  instance.update(<MyFixture props={[]} />);

  expect(instance.toJSON()).toBe('Hello, Satoshi!');
});

// TODO: fixtureState change creates new instance (new key)

// TODO: fixtureState change transitions props (reuse key)

// TODO: captures props from multiple components

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

function getPropsWithNoValues() {
  return [
    {
      component: { id: 1, name: 'Test' },
      values: []
    }
  ];
}
