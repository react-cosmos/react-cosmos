import React, { useCallback, useMemo } from 'react';
import {
  FixtureStateValues,
  InputsFixtureState,
  StandardInputFixtureState,
} from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { ExpandCollapseValues } from '../../components/ValueInputTree/ExpandCollapseValues.js';
import { ValueInputTree } from '../../components/ValueInputTree/index.js';
import { InputSlotProps } from '../../slots/InputSlot.js';
import { InputsActionSlotProps } from '../../slots/InputsActionSlot.js';
import { StandardInputSpec } from './spec.js';
import { useTreeExpansionStorage } from './storage.js';

const { namedPlug, plug, register } = createPlugin<StandardInputSpec>({
  name: 'standardInput',
});

type StandardInputSlotProps = InputSlotProps<StandardInputFixtureState>;

plug<StandardInputSlotProps>(
  'input-standard',
  ({ pluginContext, slotProps }) => {
    const { inputName, input, onFixtureStateChange } = slotProps;
    const treeExpansionApi = useTreeExpansionStorage(pluginContext);

    const values = useMemo(
      () => ({ [inputName]: input.currentValue }),
      [input.currentValue, inputName]
    );

    const handleValueChange = useCallback(
      (updatedValues: FixtureStateValues) => {
        onFixtureStateChange(fixtureState => ({
          ...fixtureState,
          [inputName]: {
            ...input,
            currentValue: updatedValues[inputName],
          },
        }));
      },
      [input, inputName, onFixtureStateChange]
    );

    return (
      <ValueInputTree
        id={`input-${inputName}`}
        values={values}
        onValueChange={handleValueChange}
        {...treeExpansionApi}
      />
    );
  }
);

namedPlug<InputsActionSlotProps>(
  'inputsAction',
  'expandCollapse',
  ({ pluginContext, slotProps }) => {
    const { inputs } = slotProps;
    const treeExpansionApi = useTreeExpansionStorage(pluginContext);

    return (
      <ExpandCollapseValues
        values={extractValuesFromStandardInputs(inputs)}
        {...treeExpansionApi}
      />
    );
  }
);

function extractValuesFromStandardInputs(
  inputs: InputsFixtureState
): FixtureStateValues {
  const values: FixtureStateValues = {};
  Object.keys(inputs).forEach(inputName => {
    const input = inputs[inputName];
    if (input.type === 'standard') values[inputName] = input.currentValue;
  });
  return values;
}

export { register };

if (process.env.NODE_ENV !== 'test') register();
