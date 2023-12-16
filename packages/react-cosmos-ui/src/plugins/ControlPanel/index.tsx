import React, { useCallback } from 'react';
import { ControlsFixtureState } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { SidePanelRowSlotProps } from '../../slots/SidePanelRowSlot.js';
import { ControlPanel } from './ControlPanel.js';
import { SetControlsFixtureState } from './shared.js';
import { ControlPanelSpec } from './spec.js';

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
    const { getFixtureState, setFixtureState } = slotProps;

    const fixtureState = getFixtureState<ControlsFixtureState>('controls');
    const onFixtureStateChange = useCallback<SetControlsFixtureState>(
      update => setFixtureState<ControlsFixtureState>('controls', update),
      [setFixtureState]
    );

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

if (process.env.NODE_ENV !== 'test') register();
