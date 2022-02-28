import React from 'react';
import { ControlPanelSpec } from 'react-cosmos-shared2/ui';
import { createPlugin } from 'react-plugin';
import { SidePanelRowSlotProps } from '../../shared/slots/SidePanelRowSlot';
import { ControlPanel } from './ControlPanel';

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

register();
