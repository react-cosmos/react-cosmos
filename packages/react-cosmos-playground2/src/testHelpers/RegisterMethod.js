// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class RegisterMethod extends Component<{
  methodName: string,
  handler: Function
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  unregisterMethods = () => {};

  componentDidMount() {
    const { methodName, handler } = this.props;
    this.unregisterMethods = this.context.registerMethods({
      [methodName]: handler
    });
  }

  componentWillUnmount() {
    this.unregisterMethods();
  }

  render() {
    return null;
  }
}
