// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class OnPluginState extends Component<{
  pluginName: string,
  handler: Function
}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    const { pluginName, handler } = this.props;
    handler(this.context.getState(pluginName));

    return null;
  }
}
