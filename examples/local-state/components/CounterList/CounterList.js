import React from 'react';
import Counter from '../Counter/Counter';

export default class CounterList extends React.Component {
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
