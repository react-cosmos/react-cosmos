import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type FixtureActionSlotProps = {
  fixtureId: FixtureId;
};

type Props = {
  slotProps: FixtureActionSlotProps;
  plugOrder: string[];
};

export function FixtureActionSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="fixtureAction"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
