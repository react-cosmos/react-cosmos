import React from 'react';
import { Slot } from 'react-plugin';
import { RendererHeaderSlotProps } from './shared';

export type Props = {
  slotProps: RendererHeaderSlotProps;
};

export function RendererHeaderSlot({ slotProps }: Props) {
  return <Slot name="rendererHeader" slotProps={slotProps} />;
}
