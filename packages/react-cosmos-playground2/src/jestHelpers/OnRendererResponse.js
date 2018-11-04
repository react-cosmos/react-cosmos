// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';

export class OnRendererResponse extends Component<{
  handler: RendererResponse => mixed
}> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    this.context.onRendererResponse(this.props.handler);
  }

  render() {
    return null;
  }
}
