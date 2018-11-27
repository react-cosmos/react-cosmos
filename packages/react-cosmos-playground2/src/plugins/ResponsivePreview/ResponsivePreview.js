// @flow

import React, { Component } from 'react';
import { PluginContext } from '../../plugin';

import type { Node } from 'react';
import type { PluginContextValue } from '../../plugin';
import type { ResponsivePreviewState } from './shared';

type Props = {
  children: Node
};

export class ResponsivePreview extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  getOwnState(): ResponsivePreviewState {
    return this.context.getState('responsive-preview');
  }

  render() {
    const { children } = this.props;
    const { enabled } = this.getOwnState();

    if (!enabled) {
      return children;
    }

    return (
      <div style={{ flex: 1, background: 'red', padding: 50 }}>{children}</div>
    );
  }
}
