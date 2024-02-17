import { isEqual } from 'lodash-es';
import React from 'react';
import {
  ControlsFixtureState,
  FixtureStateValue,
  createValue,
  extendWithValue,
} from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useValueFixtureState(inputName: string, defaultValue: unknown) {
  const [, setFixtureState] = useFixtureState<ControlsFixtureState>('controls');
  React.useEffect(() => {
    // The fixture state for this value is (re)created in two situations:
    // 1. Initially: No corresponding fixture state value is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(prevFs => {
      const controlFs = prevFs && prevFs[inputName];
      if (
        controlFs &&
        controlFs.type === 'standard' &&
        fsValueExtendsBaseValue(controlFs.defaultValue, defaultValue)
      )
        return prevFs;

      return {
        ...prevFs,
        [inputName]: {
          type: 'standard',
          defaultValue: createValue(defaultValue),
          currentValue: createValue(defaultValue),
        },
      };
    });
  }, [setFixtureState, inputName, defaultValue]);
}

function fsValueExtendsBaseValue(
  fsValue: FixtureStateValue,
  baseValue: unknown
) {
  return isEqual(baseValue, extendWithValue(baseValue, fsValue));
}
