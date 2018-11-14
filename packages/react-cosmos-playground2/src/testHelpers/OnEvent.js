// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { PlaygroundContextValue } from '../index.js.flow';

export class OnEvent extends Component<{
  eventName: string,
  handler: Function
}> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

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
