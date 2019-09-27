import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Slot } from 'react-plugin';

export type RendererPanelSlotProps = {
  fixtureId: FixtureId;
};

type Props = {
  slotProps: RendererPanelSlotProps;
};

export function RendererPanelSlot({ slotProps }: Props) {
  return <Slot name="rendererPanel" slotProps={slotProps} />;
}
