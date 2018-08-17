// @flow

import { isElement } from 'react-is';
import React, { Component } from 'react';
import { CaptureProps } from './CaptureProps';

import type { Node, Element } from 'react';

type Props = {
  children: Node
};

// TODO: Rename?
export class CosmosRenderer extends Component<Props> {
  render() {
    const { children } = this.props;

    if (!isElement(children)) {
      return children;
    }

    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = children;

    return <CaptureProps>{element}</CaptureProps>;
  }
}
