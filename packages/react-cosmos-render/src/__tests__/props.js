// @flow

import React, { Component } from 'react';
import { create as render } from 'react-test-renderer';
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
    ).toJSON()
  ).toBe('Hello, Satoshi!');
});

// TODO: Test fixtureData.props
