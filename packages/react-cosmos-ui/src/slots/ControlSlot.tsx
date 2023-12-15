import React from 'react';
import {
  ControlFixtureState,
  ControlsFixtureState,
  StateUpdater,
} from 'react-cosmos-core';
import { Slot } from 'react-plugin';

export type ControlSlotProps<TControl extends ControlFixtureState> = {
  controlName: string;
  control: TControl;
  onFixtureStateChange: (
    stateUpdater: StateUpdater<ControlsFixtureState | undefined>
  ) => void;
};

type Props = {
  slotProps: ControlSlotProps<any>;
};

export function ControlSlot({ slotProps }: Props) {
  return (
    <Slot name={`control-${slotProps.control.type}`} slotProps={slotProps} />
  );
}
