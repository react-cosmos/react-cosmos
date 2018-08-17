// @flow

import { Component } from 'react';

import type { Element } from 'react';

type Props = {
  children: Element<any>
};

export class CaptureProps extends Component<Props> {
  static cosmosCaptureProps = false;

  componentDidMount() {
    const { type, props } = this.props.children;

    if (type.cosmosCaptureProps !== false) {
      // TODO: Communicate via Context
      console.log('Captured component props', props);
    }
  }

  render() {
    const { children } = this.props;

    return children;
  }
}
