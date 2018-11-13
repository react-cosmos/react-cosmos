// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class SetPluginState extends Component<{
  pluginName: string,
  state: Object
}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  componentDidMount() {
    const { pluginName, state } = this.props;
    this.context.setState(pluginName, state);
  }

  render() {
    return null;
  }
}
