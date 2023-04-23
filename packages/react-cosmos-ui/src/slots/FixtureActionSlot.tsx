import React from 'react';
import { FlatFixtureTreeItem } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type FixtureActionSlotProps = {
  fixtureItem: FlatFixtureTreeItem;
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
