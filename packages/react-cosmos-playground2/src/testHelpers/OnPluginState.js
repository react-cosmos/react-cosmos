// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class OnPluginState extends Component<{
  pluginName: string,
  handler: Function
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  render() {
    const { pluginName, handler } = this.props;
    handler(this.context.getState(pluginName));

    return null;
  }
}
