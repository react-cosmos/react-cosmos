// @flow

import React, { Component } from 'react';

export class Counter extends Component<{ suffix: string }, { count: number }> {
  state = { count: 0 };

  render() {
    return (
      <button
        onClick={() => this.setState(({ count }) => ({ count: count + 1 }))}
      >
        {this.state.count} {this.props.suffix}
      </button>
    );
  }
}
