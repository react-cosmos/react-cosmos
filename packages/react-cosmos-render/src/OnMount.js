// @flow

import { Component } from 'react';

import type { Node } from 'react';

type Props = {
  children: Node,
  cb: Function
};

export class OnMount extends Component<Props> {
  componentDidMount() {
    this.props.cb();
  }

  render() {
    return this.props.children;
  }
}
