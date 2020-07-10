import React from 'react';
import { createPlugin } from 'react-plugin';
import { ControlPanelRowSlotProps } from '../../shared/slots/ControlPanelRowSlot';
import { ValuesPanelSpec } from './public';
import { ValuesPanel } from './ValuesPanel';

// TODO: Rename to ControlPanel
const { namedPlug, register } = createPlugin<ValuesPanelSpec>({
  name: 'valuesPanel',
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'values',
  ({ slotProps }) => {
    const { fixtureState, onFixtureStateChange } = slotProps;
    return (
      <ValuesPanel
        fixtureState={fixtureState}
        onFixtureStateChange={onFixtureStateChange}
      />
    );
  }
);

export { register };
