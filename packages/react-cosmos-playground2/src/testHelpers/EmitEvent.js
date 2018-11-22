// @flow

import { Component } from 'react';
import { PluginContext } from '../plugin';

import type { PluginContextValue } from '../plugin';

export class EmitEvent extends Component<{
  eventName: string,
  args: any[]
}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  componentDidMount() {
    const { eventName, args } = this.props;

    // NOTE: setTimeout should not longer be required once the plugin API no
    // longer revolves around the React lifecycle. Events listeners should
    // be registered before any component is renderered. But at the moment
    // event listeners are registered inside componentDidMount methods of
    // plugin components.
    setTimeout(() => {
      this.context.emitEvent(eventName, ...args);
    });
  }

  render() {
    return null;
  }
}
