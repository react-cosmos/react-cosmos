import React from 'react';
import { ControlsFixtureState } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type ControlActionSlotProps = {
  controls: ControlsFixtureState;
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
