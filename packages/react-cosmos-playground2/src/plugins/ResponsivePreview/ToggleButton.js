// @flow

import React, { Component } from 'react';
import { PluginContext } from '../../plugin';
import { DEFAULT_VIEWPORT, getResponsivePreviewStorageKey } from './shared';

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

  handleClick = async () => {
    const defaultViewport = await getDefaultViewport(this.context);

    this.setOwnState(({ enabled, viewport }) =>
      enabled
        ? // https://github.com/facebook/flow/issues/2892#issuecomment-263055197
          // $FlowFixMe
          { enabled: false, viewport }
        : { enabled: true, viewport: viewport || defaultViewport }
    );
  };
}

async function getDefaultViewport({ getConfig, callMethod }) {
  const projectId = getConfig('core.projectId');
  const storageKey = getResponsivePreviewStorageKey(projectId);
  const storedViewport = await callMethod('storage.getItem', storageKey);

  return storedViewport || DEFAULT_VIEWPORT;
}
