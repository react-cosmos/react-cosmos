// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { RendererResponse } from 'react-cosmos-shared2/renderer';

export class ReceiveRendererResponse extends Component<{
  msg: RendererResponse
}> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    setTimeout(() => {
      this.context.receiveRendererResponse(this.props.msg);
    });
  }

  render() {
    return null;
  }
}
