import * as React from 'react';
import { StateUpdater, SetStateAsync } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { SmartphoneIcon } from '../../../shared/icons';
import { Button } from '../../../shared/components';
import { StorageMethods } from '../shared';
import { getDefaultViewport } from '../storage';
import { ResponsivePreviewSpec } from '../public';

type PluginState = ResponsivePreviewSpec['state'];

export type Props = {
  state: PluginState;
  projectId: string;
  fixtureState: FixtureState;
  validFixtureSelected: boolean;
  setState: SetStateAsync<PluginState | StateUpdater<PluginState>>;
  setFixtureStateViewport: () => void;
  storage: StorageMethods;
};

export class ToggleButton extends React.Component<Props> {
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
          ? { enabled: false, viewport }
          : { enabled: true, viewport: viewport || defaultViewport },
      () => {
        setFixtureStateViewport();
      }
    );
  };
}

function isResponsiveModeOn(
  enabled: boolean,
  fixtureState: FixtureState
): boolean {
  return fixtureState.viewport ? true : enabled;
}
