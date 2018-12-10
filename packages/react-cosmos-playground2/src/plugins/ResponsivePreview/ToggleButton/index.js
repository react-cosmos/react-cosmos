// @flow

import React, { Component } from 'react';
import { getFixtureViewport } from '../shared';
import { getDefaultViewport } from '../storage';

import type { SetState } from 'react-cosmos-shared2/util';
import type { RendererItemState } from '../../Renderer';
import type { UrlParams } from '../../Router';
import type { Storage } from '../../Storage';
import type { ResponsivePreviewState } from '../shared';

export type Props = {
  state: ResponsivePreviewState,
  projectId: string,
  urlParams: UrlParams,
  primaryRendererState: null | RendererItemState,
  setState: SetState<ResponsivePreviewState>,
  setFixtureStateViewport: () => void,
  storage: Storage
};

export class ToggleButton extends Component<Props> {
  render() {
    const { state, urlParams, primaryRendererState } = this.props;

    if (!urlParams.fixturePath) {
      return null;
    }

    return (
      <label style={{ userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={isResponsiveModeOn(state.enabled, primaryRendererState)}
          onChange={this.handleToggle}
        />
        responsive
      </label>
    );
  }

  handleToggle = async () => {
    const {
      projectId,
      primaryRendererState,
      setFixtureStateViewport,
      storage
    } = this.props;
    const defaultViewport = await getDefaultViewport(projectId, storage);

    this.props.setState(
      ({ enabled, viewport }) =>
        isResponsiveModeOn(enabled, primaryRendererState)
          ? // https://github.com/facebook/flow/issues/2892#issuecomment-263055197
            // $FlowFixMe
            { enabled: false, viewport }
          : { enabled: true, viewport: viewport || defaultViewport },
      () => {
        setFixtureStateViewport();
      }
    );
  };
}

function isResponsiveModeOn(
  enabled: boolean,
  primaryRendererState: null | RendererItemState
): boolean {
  return getFixtureViewport(primaryRendererState) ? true : enabled;
}
