// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class OnEvent extends Component<{
  eventName: string,
  handler: Function
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  removeListener = () => {};

  componentDidMount() {
    const { eventName, handler } = this.props;
    this.removeListener = this.context.addEventListener(eventName, handler);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return null;
  }
}
