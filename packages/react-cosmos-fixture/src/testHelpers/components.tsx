/* tslint:disable:max-classes-per-file */

import * as React from 'react';

export function HelloMessage({ name }: { name?: string }) {
  return <>{`Hello ${name || 'Stranger'}`}</>;
}

export class Wrapper extends React.Component<{ children?: React.ReactNode }> {
  render() {
    return this.props.children;
  }
}

// This one is meant for attaching refs
export class HelloMessageCls extends React.Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

export class Counter extends React.Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;
    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

export class CoolCounter extends React.Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} timez`;
  }
}

export class SuffixCounter extends React.Component<
  { suffix: string },
  { count: number }
> {
  state = { count: 0 };

  render() {
    return `${this.state.count} ${this.props.suffix}`;
  }
}
