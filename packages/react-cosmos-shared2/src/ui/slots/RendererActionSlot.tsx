import React from 'react';
import { ArraySlot } from 'react-plugin';
import { FixtureId } from '../../renderer';

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
