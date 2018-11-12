// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class EmitEvent extends Component<{
  eventName: string,
  args: any[]
}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  componentDidMount() {
    const { eventName, args } = this.props;

    setTimeout(() => {
      this.context.emitEvent(eventName, ...args);
    });
  }

  render() {
    return null;
  }
}
