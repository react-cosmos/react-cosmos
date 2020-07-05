import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
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
