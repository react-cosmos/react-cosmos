import React, { Component } from 'react';

export class Counter extends Component {
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
