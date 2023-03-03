import { isEqual } from 'lodash-es';
import React from 'react';
import {
  FixtureState,
  FixtureStateControl,
  FixtureStateControls,
  StateUpdater,
} from 'react-cosmos-core';
import { IconButton32 } from '../../components/buttons/index.js';
import { RotateCcwIcon } from '../../components/icons/index.js';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../components/SidePanel.js';
import { ControlActionSlot } from '../../slots/ControlActionSlot.js';
import { ControlSlot } from '../../slots/ControlSlot.js';

type Props = {
  fixtureState: FixtureState;
  controlActionOrder: string[];
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export function ControlPanel({
  fixtureState,
  controlActionOrder,
  onFixtureStateChange,
}: Props) {
  const handleControlsReset = React.useCallback(
    () => onFixtureStateChange(resetControls),
    [onFixtureStateChange]
  );

  const controls = fixtureState.controls || {};
  if (Object.keys(controls).length === 0) return null;

  return (
    <SidePanelContainer>
      <SidePanelHeader>
        <SidePanelTitle label="Controls" />
        <SidePanelActions>
          <IconButton32
            title="Reset to default values"
            icon={<RotateCcwIcon />}
            disabled={areControlsUnchanged(controls)}
            onClick={handleControlsReset}
          />
          <ControlActionSlot
            slotProps={{ controls }}
            plugOrder={controlActionOrder}
          />
        </SidePanelActions>
      </SidePanelHeader>
      <SidePanelBody>
        {Object.keys(controls).map(controlName => (
          <ControlSlot
            key={controlName}
            slotProps={{
              controlName,
              control: controls[controlName],
              onFixtureStateChange,
            }}
          />
        ))}
      </SidePanelBody>
    </SidePanelContainer>
  );
}

function areControlsUnchanged(controls: FixtureStateControls) {
  return Object.keys(controls).every(controlName =>
    isEqual(
      controls[controlName].currentValue,
      controls[controlName].defaultValue
    )
  );
}

function resetControls(fixtureState: FixtureState) {
  const controls = fixtureState.controls ? { ...fixtureState.controls } : {};
  Object.keys(controls).forEach(controlName => {
    controls[controlName] = resetControl(controls[controlName]);
  });
  return { ...fixtureState, controls };
}

function resetControl<TControl extends FixtureStateControl>(control: TControl) {
  return { ...control, currentValue: control.defaultValue };
}
