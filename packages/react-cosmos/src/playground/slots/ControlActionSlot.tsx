import React from 'react';
import { ArraySlot } from 'react-plugin';
import { FixtureStateControls } from '../../core/fixtureState/types';

export type ControlActionSlotProps = {
  controls: FixtureStateControls;
};

type Props = {
  slotProps: ControlActionSlotProps;
  plugOrder: string[];
};

export function ControlActionSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="controlAction"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
