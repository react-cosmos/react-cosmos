// @flow

import React, { Component } from 'react';
import { ComponentState } from 'react-cosmos-fixture';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return (
      <button
        onClick={() => this.setState(({ count }) => ({ count: count + 1 }))}
      >
        {this.state.count} times
      </button>
    );
  }
}

export default (
  <ComponentState state={{ count: 3 }}>
    <Counter />
  </ComponentState>
);
