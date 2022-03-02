import React from 'react';
import { ArraySlot } from 'react-plugin';
import { FixtureId } from '../../renderer';

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
