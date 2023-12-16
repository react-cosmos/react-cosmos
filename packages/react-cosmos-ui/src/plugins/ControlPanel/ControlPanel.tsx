import { isEqual } from 'lodash-es';
import React from 'react';
import { ControlFixtureState, ControlsFixtureState } from 'react-cosmos-core';
import {
  SidePanelActions,
  SidePanelBody,
  SidePanelContainer,
  SidePanelHeader,
  SidePanelTitle,
} from '../../components/SidePanel.js';
import { IconButton32 } from '../../components/buttons/index.js';
import { RotateCcwIcon } from '../../components/icons/index.js';
import { ControlActionSlot } from '../../slots/ControlActionSlot.js';
import { ControlSlot } from '../../slots/ControlSlot.js';
import { SetControlsFixtureState } from './shared.js';

type Props = {
  fixtureState: ControlsFixtureState | undefined;
  controlActionOrder: string[];
  onFixtureStateChange: SetControlsFixtureState;
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

  const controls = fixtureState ?? {};
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

function areControlsUnchanged(controls: ControlsFixtureState) {
  return Object.keys(controls).every(controlName =>
    isEqual(
      controls[controlName].currentValue,
      controls[controlName].defaultValue
    )
  );
}

function resetControls(fixtureState: ControlsFixtureState | undefined) {
  const controls = fixtureState ? { ...fixtureState } : {};
  Object.keys(controls).forEach(controlName => {
    controls[controlName] = resetControl(controls[controlName]);
  });
  return controls;
}

function resetControl<TControl extends ControlFixtureState>(control: TControl) {
  return { ...control, currentValue: control.defaultValue };
}
