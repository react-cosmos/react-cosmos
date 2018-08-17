// @flow

import { Component } from 'react';

import type { Node, ElementRef } from 'react';

type RefCb = (ref: ?ElementRef<any>) => mixed;

type Props = {
  children: RefCb => Node,
  state: Object
};

export class ComponentState extends Component<Props> {
  handleRef = (ref: ?ElementRef<any>) => {
    if (ref) {
      ref.setState(this.props.state);
    }
  };

  render() {
    return this.props.children(this.handleRef);
  }
}
