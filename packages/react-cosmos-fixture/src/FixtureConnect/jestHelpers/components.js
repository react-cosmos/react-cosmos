/* eslint-env jest */
/* istanbul ignore file */
// @flow

import { Component } from 'react';

export class HelloMessage extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

export class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

export class CoolCounter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} timez`;
  }
}

export class SuffixCounter extends Component<
  { suffix: string },
  { count: number }
> {
  state = { count: 0 };

  render() {
    return `${this.state.count} ${this.props.suffix}`;
  }
}
