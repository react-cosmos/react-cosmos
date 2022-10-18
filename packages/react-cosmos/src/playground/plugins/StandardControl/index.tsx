import React, { useCallback, useMemo } from 'react';
import { createPlugin } from 'react-plugin';
import {
  FixtureStateControls,
  FixtureStateStandardControl,
  FixtureStateValues,
} from 'react-cosmos-core/fixtureState';
import { ExpandCollapseValues } from '../../components/ValueInputTree/ExpandCollapseValues.js';
import { ValueInputTree } from '../../components/ValueInputTree/index.js';
import { ControlActionSlotProps } from '../../slots/ControlActionSlot.js';
import { ControlSlotProps } from '../../slots/ControlSlot.js';
import { StandardControlSpec } from './spec.js';
import { useTreeExpansionStorage } from './storage.js';

const { namedPlug, plug, register } = createPlugin<StandardControlSpec>({
  name: 'standardControl',
});

type StandardControlSlotProps = ControlSlotProps<FixtureStateStandardControl>;

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
          controls: {
            ...fixtureState.controls,
            [controlName]: {
              ...control,
              currentValue: updatedValues[controlName],
            },
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
  controls: FixtureStateControls
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
