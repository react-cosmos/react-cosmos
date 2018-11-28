// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class CallMethod extends Component<{
  methodName: string,
  args?: any[],
  onReturn?: Function
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  componentDidMount() {
    const { methodName, args = [], onReturn } = this.props;

    setTimeout(() => {
      const returnVal = this.context.callMethod(methodName, ...args);

      if (typeof onReturn === 'function') {
        onReturn(returnVal);
      }
    });
  }

  render() {
    return null;
  }
}
