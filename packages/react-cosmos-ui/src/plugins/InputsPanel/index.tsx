import React, { useCallback } from 'react';
import type { InputsFixtureState } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import type { ControlPanelRowSlotProps } from '../../slots/ControlPanelRowSlot.js';
import { InputsPanel } from './InputsPanel.js';
import type { SetInputsFixtureState } from './shared.js';
import type { InputsPanelSpec } from './spec.js';

const { namedPlug, register } = createPlugin<InputsPanelSpec>({
  name: 'inputsPanel',
  defaultConfig: {
    actionOrder: [],
  },
});

namedPlug<ControlPanelRowSlotProps>(
  'controlPanelRow',
  'inputs',
  ({ pluginContext, slotProps }) => {
    const { actionOrder } = pluginContext.getConfig();
    const { getFixtureState, setFixtureState } = slotProps;

    const fixtureState = getFixtureState<InputsFixtureState>('inputs');
    const onFixtureStateChange = useCallback<SetInputsFixtureState>(
      update => setFixtureState<InputsFixtureState>('inputs', update),
      [setFixtureState]
    );

    return (
      <InputsPanel
        fixtureState={fixtureState}
        actionOrder={actionOrder}
        onFixtureStateChange={onFixtureStateChange}
      />
    );
  }
);

export { register };

if (process.env.NODE_ENV !== 'test') register();
