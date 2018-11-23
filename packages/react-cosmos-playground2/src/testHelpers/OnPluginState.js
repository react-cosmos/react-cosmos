// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class OnPluginState extends Component<{
  stateKey: string,
  handler: Function
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    const { stateKey, handler } = this.props;
    handler(this.context.getState(stateKey));

    return null;
  }
}
