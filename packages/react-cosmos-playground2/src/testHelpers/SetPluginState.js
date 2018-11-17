// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class SetPluginState extends Component<{
  stateKey: string,
  value: Object
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  componentDidMount() {
    const { stateKey, value } = this.props;
    this.context.setState(stateKey, value);
  }

  render() {
    return null;
  }
}
