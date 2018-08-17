// @flow

import React, { Component } from 'react';
import { render } from './_shared';

class HelloMessage extends Component<{ name: string }> {
  render() {
    return `Hello, ${this.props.name}!`;
  }
}

it('renders fixture with props', () => {
  expect(render(<HelloMessage name="Satoshi" />)).toBe('Hello, Satoshi!');
});
