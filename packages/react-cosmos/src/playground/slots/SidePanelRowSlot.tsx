import React from 'react';
import { FixtureId } from 'react-cosmos-core/fixture';
import { FixtureState } from 'react-cosmos-core/fixtureState';
import { StateUpdater } from 'react-cosmos-core/utils';
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
