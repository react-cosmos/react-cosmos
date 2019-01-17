// @flow

import React, { Component } from 'react';
import { getFixtureViewport } from '../shared';
import { getDefaultViewport } from '../storage';
import { SmartphoneIcon } from '../../../shared/icons';
import { Button } from '../../../shared/components';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { Storage } from '../../Storage';
import type { ResponsivePreviewState } from '../shared';

export type Props = {
  state: ResponsivePreviewState,
  projectId: string,
  fixtureState: null | FixtureState,
  validFixtureSelected: boolean,
  setState: SetState<ResponsivePreviewState>,
  setFixtureStateViewport: () => void,
  storage: Storage
};

export class ToggleButton extends Component<Props> {
  render() {
    const { state, fixtureState, validFixtureSelected } = this.props;

    if (!validFixtureSelected) {
      return <Button icon={<SmartphoneIcon />} label="responsive" disabled />;
    }

    return (
      <Button
        icon={<SmartphoneIcon />}
        label="responsive"
        selected={isResponsiveModeOn(state.enabled, fixtureState)}
        onClick={this.handleToggle}
      />
    );
  }

  handleToggle = async () => {
    const {
      projectId,
      fixtureState,
      setFixtureStateViewport,
      storage
    } = this.props;
    const defaultViewport = await getDefaultViewport(projectId, storage);

    this.props.setState(
      ({ enabled, viewport }) =>
        isResponsiveModeOn(enabled, fixtureState)
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
  fixtureState: null | FixtureState
): boolean {
  return getFixtureViewport(fixtureState) ? true : enabled;
}
