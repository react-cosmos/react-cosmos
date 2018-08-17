// @flow

import React, { Component } from 'react';

import type { Element, Node, ElementRef } from 'react';

type RefCb = (ref: ?ElementRef<any>) => mixed;

type Props = {
  children: Element<any> | (RefCb => Node),
  state: Object
};

export class ComponentState extends Component<Props> {
  handleRef = (ref: ?ElementRef<any>) => {
    if (ref) {
      ref.setState(this.props.state);
    }
  };

  render() {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(this.handleRef);
    }

    // Hack alert: Editing React Element by hand
    return <children.type {...children.props} ref={this.handleRef} />;
  }
}
