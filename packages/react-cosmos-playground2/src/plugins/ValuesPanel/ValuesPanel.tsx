import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateControl,
  FixtureStateControls,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { Slot } from 'react-plugin';
import { ControlSlotProps } from '.';
import { IconButton32 } from '../../shared/buttons';
import { RotateCcwIcon } from '../../shared/icons';
import {
  Actions,
  Body,
  Container,
  Header,
  Title,
} from '../../shared/valueInputTree';

type Props = {
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

export function ValuesPanel({ fixtureState, onFixtureStateChange }: Props) {
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
        </Actions>
      </Header>
      <Body>
        {Object.keys(controls).map(controlName => {
          const control = controls[controlName];
          // TODO: Create ControlSlot component
          const slotProps: ControlSlotProps<typeof control> = {
            controlName,
            control,
            onFixtureStateChange,
          };
          return (
            <Slot
              key={controlName}
              name={`control-${control.type}`}
              slotProps={slotProps}
            />
          );
        })}
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
