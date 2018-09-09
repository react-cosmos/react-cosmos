// @flow

import React, { Component } from 'react';
import { ComponentState } from 'react-cosmos-fixture';

class Counter extends Component<{ suffix: string }, { count: number }> {
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

export default (
  <ComponentState state={{ count: 5 }}>
    <Counter suffix="times" />
  </ComponentState>
);
