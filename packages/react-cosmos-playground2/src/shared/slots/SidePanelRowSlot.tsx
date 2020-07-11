import React from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { ArraySlot } from 'react-plugin';

export type SidePanelRowSlotProps = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  onFixtureStateChange: (stateUpdater: StateUpdater<FixtureState>) => void;
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
