import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { ArraySlot } from 'react-plugin';

export type ControlPanelRowSlotProps = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
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
