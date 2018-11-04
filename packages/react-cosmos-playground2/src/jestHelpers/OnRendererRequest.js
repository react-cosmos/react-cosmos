// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';

export class OnRendererRequest extends Component<{
  handler: RendererRequest => mixed
}> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    this.context.onRendererRequest(this.props.handler);
  }

  render() {
    return null;
  }
}
