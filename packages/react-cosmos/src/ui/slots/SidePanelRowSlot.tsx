import React from 'react';
import { ArraySlot } from 'react-plugin';
import { FixtureId } from '../../renderer/types';
import { FixtureState } from '../../utils/fixtureState/types';
import { StateUpdater } from '../../utils/types';

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
