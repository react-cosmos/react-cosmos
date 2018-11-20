// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class OnPluginState extends Component<{
  stateKey: string,
  handler: Function
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    const { stateKey, handler } = this.props;
    handler(this.context.getState(stateKey));

    return null;
  }
}
