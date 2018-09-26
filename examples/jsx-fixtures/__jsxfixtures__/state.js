// @flow

import React, { Component } from 'react';
import { StateMock } from '@react-mock/state';

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
  <StateMock state={{ count: 5 }}>
    <Counter suffix="times" />
  </StateMock>
);
