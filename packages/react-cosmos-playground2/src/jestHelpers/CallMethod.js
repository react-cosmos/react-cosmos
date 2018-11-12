// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class CallMethod extends Component<{ methodName: string, args: any[] }> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  componentDidMount() {
    const { methodName, args } = this.props;

    setTimeout(() => {
      this.context.callMethod(methodName, ...args);
    });
  }

  render() {
    return null;
  }
}
