// @flow

import React, { Component } from 'react';
import { create as render } from 'react-test-renderer';
import { Fixture } from '../Fixture';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name || 'Guest'}!`;
  }
}

it('renders with props', () => {
  expect(
    render(
      <Fixture>
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

it('captures props', () => {
  const onUpdate = jest.fn();
  render(
    <Fixture onUpdate={onUpdate}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  expect(onUpdate).toHaveBeenCalledWith({
    props: [
      {
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
});

it('overwrites prop', () => {
  expect(
    render(
      <Fixture
        fixtureData={{
          props: [
            {
              serializable: true,
              key: 'name',
              value: 'Vitalik'
            }
          ]
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Vitalik!');
});

it('removes prop', () => {
  expect(
    render(
      <Fixture
        fixtureData={{
          props: []
        }}
      >
        <HelloMessage name="Satoshi" />
      </Fixture>
    ).toJSON()
  ).toBe('Hello, Guest!');
});

// TODO: fixtureData change

// TODO: fixtureData change to null

// TODO: fixtureData change creates new instance (new key)

// TODO: fixtureData change transitions props (reuse key)

// TODO: captures props from multiple components
