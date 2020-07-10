import { isEqual } from 'lodash';
import React from 'react';
import {
  FixtureState,
  FixtureStateControl,
  FixtureStateControls,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { IconButton32 } from '../../shared/buttons';
import { RotateCcwIcon } from '../../shared/icons';
import { ControlActionSlot } from '../../shared/slots/ControlActionSlot';
import { ControlSlot } from '../../shared/slots/ControlSlot';
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

  // TODO: plugOrder
  const controlActionOrder: string[] = [];
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
