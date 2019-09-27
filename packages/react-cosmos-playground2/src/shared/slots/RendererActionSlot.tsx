import React from 'react';
import { ArraySlot } from 'react-plugin';
import { RendererActionSlotProps } from './shared';

export type Props = {
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
