import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateControl,
  FixtureStateControls,
} from '../../../utils/fixtureState/types';
import { StateUpdater } from '../../../utils/types';
import {
  Actions,
  Body,
  Container,
  Header,
  Title,
} from '../../shared/sidePanelUi';
import { ControlActionSlot } from '../../slots/ControlActionSlot';
import { ControlSlot } from '../../slots/ControlSlot';
import { IconButton32 } from '../../ui/components/buttons';
import { RotateCcwIcon } from '../../ui/components/icons';

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
    <Container>
      <Header>
        <Title label="Controls" />
        <Actions>
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
        </Actions>
      </Header>
      <Body>
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
      </Body>
    </Container>
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
