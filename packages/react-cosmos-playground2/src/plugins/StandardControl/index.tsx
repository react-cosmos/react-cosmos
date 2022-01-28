import React, { useCallback, useMemo } from 'react';
import {
  FixtureStateControls,
  FixtureStateStandardControl,
  FixtureStateValues,
} from 'react-cosmos-shared2/fixtureState';
import { createPlugin } from 'react-plugin';
import { ControlActionSlotProps } from '../../shared/slots/ControlActionSlot';
import { ControlSlotProps } from '../../shared/slots/ControlSlot';
import { ValueInputTree } from '../../shared/valueInputTree';
import { ExpandCollapseValues } from '../../shared/valueInputTree/ExpandCollapseValues';
import { StandardControlSpec } from './public';
import { useTreeExpansionStorage } from './storage';

const { namedPlug, plug, register } = createPlugin<StandardControlSpec>({
  name: 'standardControl',
});

type StandardControlSlotProps = ControlSlotProps<FixtureStateStandardControl>;

plug<StandardControlSlotProps>(
  'control-standard',
  ({ pluginContext, slotProps }) => {
    const { controlName, control, onFixtureStateChange } = slotProps;
    const treeExpansionApi = useTreeExpansionStorage(pluginContext);

    const values = useMemo(() => ({ [controlName]: control.currentValue }), [
      control.currentValue,
      controlName,
    ]);

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

register();
