import React, { useCallback } from 'react';
import { FixtureStateControls } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { SidePanelRowSlotProps } from '../../slots/SidePanelRowSlot.js';
import { ControlPanel } from './ControlPanel.js';
import { SetFixtureStateControls } from './shared.js';
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

    const fixtureState = getFixtureState<FixtureStateControls>('controls');
    const onFixtureStateChange = useCallback<SetFixtureStateControls>(
      update => setFixtureState('controls', update),
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
