
import React from 'react';
import Counter from '../Counter/Counter';

export default class CounterList extends React.Component {
  render() {
    return (
      <div>
        <Counter ref="c1" />
        <Counter ref="c2" />
        <Counter ref="c3" />
      </div>
    );
  }
}
