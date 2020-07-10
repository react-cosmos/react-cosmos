import React from 'react';
import { createPlugin } from 'react-plugin';
import { SidePanelRowSlotProps } from '../../shared/slots/SidePanelRowSlot';
import { ControlPanel } from './ControlPanel';
import { ControlPanelSpec } from './public';

const { namedPlug, register } = createPlugin<ControlPanelSpec>({
  name: 'controlPanel',
  defaultConfig: {
    controlActionOrder: [],
  },
});

namedPlug<SidePanelRowSlotProps>(
  'sidePanelRow',
  'values',
  ({ pluginContext, slotProps }) => {
    const { controlActionOrder } = pluginContext.getConfig();
    const { fixtureState, onFixtureStateChange } = slotProps;
    return (
      <ControlPanel
        fixtureState={fixtureState}
        controlActionOrder={controlActionOrder}
        onFixtureStateChange={onFixtureStateChange}
      />
    );
  }
);

export { register };
