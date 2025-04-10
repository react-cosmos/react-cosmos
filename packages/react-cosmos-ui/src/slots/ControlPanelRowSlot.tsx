import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { ArraySlot } from 'react-plugin';
import {
  GetFixtureState,
  SetFixtureStateByName,
} from '../plugins/RendererCore/spec.js';

export type ControlPanelRowSlotProps = {
  fixtureId: FixtureId;
  getFixtureState: GetFixtureState;
  setFixtureState: SetFixtureStateByName;
};

type Props = {
  slotProps: ControlPanelRowSlotProps;
  plugOrder: string[];
};

export function ControlPanelRowSlot({ slotProps, plugOrder }: Props) {
  return (
    <ArraySlot
      name="controlPanelRow"
      slotProps={slotProps}
      plugOrder={plugOrder}
    />
  );
}
