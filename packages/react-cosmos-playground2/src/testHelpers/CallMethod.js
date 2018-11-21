// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class CallMethod extends Component<{
  methodName: string,
  args?: any[]
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  componentDidMount() {
    const { methodName, args = [] } = this.props;

    setTimeout(() => {
      this.context.callMethod(methodName, ...args);
    });
  }

  render() {
    return null;
  }
}
