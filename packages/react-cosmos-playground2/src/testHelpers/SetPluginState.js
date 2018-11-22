// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class SetPluginState extends Component<{
  stateKey: string,
  value: Object
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  componentDidMount() {
    const { stateKey, value } = this.props;
    this.context.setState(stateKey, value);
  }

  render() {
    return null;
  }
}
