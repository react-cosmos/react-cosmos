import React, { useCallback, useMemo } from 'react';
import {
  ControlsFixtureState,
  FixtureStateValues,
  StandardControlFixtureState,
} from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { ExpandCollapseValues } from '../../components/ValueInputTree/ExpandCollapseValues.js';
import { ValueInputTree } from '../../components/ValueInputTree/index.js';
import { ControlActionSlotProps } from '../../slots/ControlActionSlot.js';
import { ControlSlotProps } from '../../slots/ControlSlot.js';
import { StandardControlSpec } from './spec.js';
import { useTreeExpansionStorage } from './storage.js';

const { namedPlug, plug, register } = createPlugin<StandardControlSpec>({
  name: 'standardControl',
});

type StandardControlSlotProps = ControlSlotProps<StandardControlFixtureState>;

plug<StandardControlSlotProps>(
  'control-standard',
  ({ pluginContext, slotProps }) => {
    const { controlName, control, onFixtureStateChange } = slotProps;
    const treeExpansionApi = useTreeExpansionStorage(pluginContext);

    const values = useMemo(
      () => ({ [controlName]: control.currentValue }),
      [control.currentValue, controlName]
    );

    const handleValueChange = useCallback(
      (updatedValues: FixtureStateValues) => {
        onFixtureStateChange(fixtureState => ({
          ...fixtureState,
          [controlName]: {
            ...control,
            currentValue: updatedValues[controlName],
          },
        }));
      },
      [control, controlName, onFixtureStateChange]
    );

    return (
      <ValueInputTree
        id={`control-${controlName}`}
        values={values}
        onValueChange={handleValueChange}
        {...treeExpansionApi}
      />
    );
  }
);

namedPlug<ControlActionSlotProps>(
  'controlAction',
  'expandCollapse',
  ({ pluginContext, slotProps }) => {
    const { controls } = slotProps;
    const treeExpansionApi = useTreeExpansionStorage(pluginContext);

    return (
      <ExpandCollapseValues
        values={extractValuesFromStandardControls(controls)}
        {...treeExpansionApi}
      />
    );
  }
);

function extractValuesFromStandardControls(
  controls: ControlsFixtureState
): FixtureStateValues {
  const values: FixtureStateValues = {};
  Object.keys(controls).forEach(controlName => {
    const control = controls[controlName];
    if (control.type === 'standard') values[controlName] = control.currentValue;
  });
  return values;
}

export { register };

if (process.env.NODE_ENV !== 'test') register();
