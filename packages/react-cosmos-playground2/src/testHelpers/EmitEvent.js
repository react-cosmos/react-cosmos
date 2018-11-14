// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class EmitEvent extends Component<{
  eventName: string,
  args: any[]
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

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
