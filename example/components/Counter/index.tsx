import React, { Component } from 'react';
import { CounterButton } from '../CounterButton';

type Props = {
  suffix: string;
};

type State = {
  count: number;
};

export class Counter extends Component<Props, State> {
  state: State = { count: 0 };

  increment = () => {
    this.setState(({ count }) => ({ count: count + 1 }));
  };

  render() {
    return (
      <CounterButton
        suffix={this.props.suffix}
        count={this.state.count}
        increment={this.increment}
      />
    );
  }
}
