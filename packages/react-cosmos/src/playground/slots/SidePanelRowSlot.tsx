import React from 'react';
import { ArraySlot } from 'react-plugin';
import { FixtureState } from '../../core/fixtureState/types.js';
import { FixtureId } from '../../core/types.js';
import { StateUpdater } from '../../utils/types.js';

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
