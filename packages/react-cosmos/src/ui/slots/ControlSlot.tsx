import React from 'react';
import { Slot } from 'react-plugin';
import {
  FixtureState,
  FixtureStateControl,
} from '../../utils/fixtureState/types';
import { StateUpdater } from '../../utils/state';

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
