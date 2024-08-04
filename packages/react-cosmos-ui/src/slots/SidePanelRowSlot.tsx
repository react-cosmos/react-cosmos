import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../plugins/RendererCore/spec.js';

export type SidePanelRowSlotProps = {
  fixtureId: FixtureId;
  getFixtureState: GetFixtureState;
  setFixtureState: SetFixtureStateByName;
};

type Props = {
  slotProps: SidePanelRowSlotProps;
  plugOrder: string[];
};

export function SidePanelRowSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="sidePanelRow"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
