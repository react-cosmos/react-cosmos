import React from 'react';

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
      <button onClick={this.onButtonClick}>{this.state.value} times</button>
    );
  }
}
