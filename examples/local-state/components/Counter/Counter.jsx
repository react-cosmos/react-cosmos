import React from 'react';

import './Counter.css';

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.state = {
      value: 0,
    };
  }

  onButtonClick() {
    this.setState({
      value: this.state.value + 1,
    });
  }

  render() {
    return (
      <button
        className="CounterButton"
        onClick={this.onButtonClick}
      >
        {`${this.props.name} clicked ${this.state.value} times`}
      </button>
    );
  }
}

Counter.defaultProps = {
  name: 'Unnamed Counter'
};
