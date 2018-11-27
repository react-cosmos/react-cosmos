// @flow

import React, { Component } from 'react';
import { PluginContext } from '../../plugin';
import { DEFAULT_VIEWPORT } from './shared';

import type { SetState } from 'react-cosmos-shared2/util';
import type { PluginContextValue } from '../../plugin';
import type { ResponsivePreviewState } from './shared';

export class ToggleButton extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  setOwnState: SetState<ResponsivePreviewState> = (stateChange, cb) => {
    this.context.setState('responsive-preview', stateChange, cb);
  };

  render() {
    return <button onClick={this.handleClick}>responsive</button>;
  }

  handleClick = () => {
    this.setOwnState(({ enabled, viewport }) =>
      enabled
        ? { enabled: false, viewport: null }
        : { enabled: true, viewport: viewport || DEFAULT_VIEWPORT }
    );
  };
}
