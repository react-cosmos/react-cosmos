import React from 'react';
import {
  FixtureStateControl,
  FixtureStateControls,
  StateUpdater,
} from 'react-cosmos-core';
import { Slot } from 'react-plugin';

export type ControlSlotProps<TControl extends FixtureStateControl> = {
  controlName: string;
  control: TControl;
  onFixtureStateChange: (
    stateUpdater: StateUpdater<FixtureStateControls | undefined>
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
