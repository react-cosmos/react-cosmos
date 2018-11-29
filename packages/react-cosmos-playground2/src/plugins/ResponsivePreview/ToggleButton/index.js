// @flow

import React, { Component } from 'react';
import { PluginContext } from '../../../plugin';
import { getUrlParams } from '../../Router/selectors';
import {
  getResponsivePreviewState,
  getFixtureViewport,
  setFixtureStateViewport
} from '../shared';
import { getDefaultViewport } from '../storage';

import type { SetState } from 'react-cosmos-shared2/util';
import type { PluginContextValue } from '../../../plugin';
import type { ResponsivePreviewState } from '../shared';

export class ToggleButton extends Component<{}> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  setOwnState: SetState<ResponsivePreviewState> = (stateChange, cb) => {
    this.context.setState('responsive-preview', stateChange, cb);
  };

  render() {
    if (!getUrlParams(this.context).fixturePath) {
      return null;
    }

    return (
      <label style={{ userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={isResponsiveModeOn(this.context)}
          onChange={this.handleToggle}
        />
        responsive
      </label>
    );
  }

  handleToggle = async () => {
    const defaultViewport = await getDefaultViewport(this.context);

    this.setOwnState(
      ({ viewport }) =>
        isResponsiveModeOn(this.context)
          ? // https://github.com/facebook/flow/issues/2892#issuecomment-263055197
            // $FlowFixMe
            { enabled: false, viewport }
          : { enabled: true, viewport: viewport || defaultViewport },
      () => {
        setFixtureStateViewport(this.context);
      }
    );
  };
}

function isResponsiveModeOn(context: PluginContextValue): boolean {
  const { enabled } = getResponsivePreviewState(context);

  return getFixtureViewport(context) ? true : enabled;
}
