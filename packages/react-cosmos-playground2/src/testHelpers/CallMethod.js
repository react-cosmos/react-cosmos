// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class CallMethod extends Component<{
  methodName: string,
  args?: any[]
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  componentDidMount() {
    const { methodName, args = [] } = this.props;

    setTimeout(() => {
      this.context.callMethod(methodName, ...args);
    });
  }

  render() {
    return null;
  }
}
