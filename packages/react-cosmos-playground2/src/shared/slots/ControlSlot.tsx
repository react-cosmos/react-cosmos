import React from 'react';
import {
  FixtureState,
  FixtureStateControl,
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { Slot } from 'react-plugin';

export type ControlSlotProps<TControl extends FixtureStateControl> = {
  controlName: string;
  control: TControl;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
};

type Props = {
  slotProps: ControlSlotProps<any>;
};

export function ControlSlot({ slotProps }: Props) {
  return (
    <Slot name={`control-${slotProps.control.type}`} slotProps={slotProps} />
  );
}
