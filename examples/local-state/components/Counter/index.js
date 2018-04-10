import React, { Component } from 'react';

import './index.css';

export class Counter extends Component {
  static defaultProps = {
    name: 'Unnamed Counter'
  };

  state = {
    value: 0
  };

  onButtonClick = () => {
    this.setState({
      value: this.state.value + 1
    });
  };

  render() {
    return (
      <button className="CounterButton" onClick={this.onButtonClick}>
        {`${this.props.name} clicked ${this.state.value} times`}
      </button>
    );
  }
}
