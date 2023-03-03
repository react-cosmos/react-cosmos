import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';

export type RendererActionSlotProps = {
  fixtureId: FixtureId;
};

type Props = {
  slotProps: RendererActionSlotProps;
  plugOrder: string[];
};

export function RendererActionSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="rendererAction"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
