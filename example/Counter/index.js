import React, { Component } from 'react';

export class Counter extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState(({ count }) => ({ count: count + 1 }));
  };

  render() {
    return (
      <button onClick={this.increment}>
        {this.state.count} {this.props.suffix}
      </button>
    );
  }
}
