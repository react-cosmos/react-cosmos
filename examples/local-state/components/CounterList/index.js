import React, { Component } from 'react';
import { Counter } from '../Counter';

export class CounterList extends Component {
  render() {
    return (
      <div>
        <Counter name="First Counter" ref="c1" />
        <Counter name="Second Counter" ref="c2" />
        <Counter name="Third Counter" ref="c3" />
      </div>
    );
  }
}
