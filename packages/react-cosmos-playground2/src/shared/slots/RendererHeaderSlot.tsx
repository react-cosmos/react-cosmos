import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Slot } from 'react-plugin';

export type RendererHeaderSlotProps = {
  fixtureId: FixtureId;
};

type Props = {
  slotProps: RendererHeaderSlotProps;
};

export function RendererHeaderSlot({ slotProps }: Props) {
  return <Slot name="rendererHeader" slotProps={slotProps} />;
}
