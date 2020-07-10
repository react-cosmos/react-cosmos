import React from 'react';
import { FixtureStateControls } from 'react-cosmos-shared2/fixtureState';
import { ArraySlot } from 'react-plugin';

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
