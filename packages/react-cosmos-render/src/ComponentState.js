// @flow

import React, { Component } from 'react';
import { CaptureProps } from './CaptureProps';

import type { Element, ElementRef } from 'react';

type RefCb = (ref: ?ElementRef<any>) => mixed;

type Props = {
  children: Element<any> | (RefCb => Element<any>),
  state: Object
};

export class ComponentState extends Component<Props> {
  static cosmosCaptureProps = false;

  render() {
    return <CaptureProps>{this.getChildren()}</CaptureProps>;
  }

  handleRef = (ref: ?ElementRef<any>) => {
    if (ref) {
      ref.setState(this.props.state);
    }
  };

  getChildren() {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(this.handleRef);
    }

    // Hack alert: Editing React Element by hand
    return <children.type {...children.props} ref={this.handleRef} />;
  }
}
