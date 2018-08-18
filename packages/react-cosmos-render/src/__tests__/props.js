// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import { Fixture } from '../Fixture';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name}!`;
  }
}

it('renders fixture with props', () => {
  expect(
    render(
      <Fixture>
        <HelloMessage name="Satoshi" />
      </Fixture>
    )
  ).toBe('Hello, Satoshi!');
});

it('captures props in fixtureData', () => {
  const onUpdate = jest.fn();
  render(
    <Fixture onUpdate={onUpdate}>
      <HelloMessage name="Satoshi" />
    </Fixture>
  );

  expect(onUpdate).toHaveBeenCalledWith({
    props: [
      {
        // TODO: Test unserializable prop
        serializable: true,
        key: 'name',
        value: 'Satoshi'
      }
    ]
  });
});

// TODO: fixtureData initial

// TODO: fixtureData change

// TODO: fixtureData change to null

// TODO: fixtureData change creates new instance (new key)

// TODO: fixtureData change transitions props (reuse key)

function render(node) {
  return create(node).toJSON();
}
