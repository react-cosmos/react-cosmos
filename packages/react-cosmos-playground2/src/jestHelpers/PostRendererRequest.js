// @flow

import { Component } from 'react';
import { PlaygroundContext } from '../PlaygroundContext';

import type { RendererRequest } from 'react-cosmos-shared2/renderer';

export class PostRendererRequest extends Component<{ msg: RendererRequest }> {
  static contextType = PlaygroundContext;

  componentDidMount() {
    setTimeout(() => {
      this.context.postRendererRequest(this.props.msg);
    });
  }

  render() {
    return null;
  }
}
