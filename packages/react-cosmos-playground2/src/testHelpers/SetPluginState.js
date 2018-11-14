// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class SetPluginState extends Component<{
  pluginName: string,
  state: Object
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  componentDidMount() {
    const { pluginName, state } = this.props;
    this.context.setState(pluginName, state);
  }

  render() {
    return null;
  }
}
