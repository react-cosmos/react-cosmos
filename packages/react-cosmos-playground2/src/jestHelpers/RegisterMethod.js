// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class RegisterMethod extends Component<{
  methodName: string,
  handler: Function
}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

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
