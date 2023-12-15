import { isEqual } from 'lodash-es';
import React from 'react';
import {
  ControlsFixtureState,
  FixtureStateData,
  FixtureStateValue,
  createValue,
  extendWithValue,
} from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useCreateFixtureState(
  inputName: string,
  defaultValue: FixtureStateData
) {
  const [, setFixtureState] = useFixtureState<ControlsFixtureState>('controls');
  React.useEffect(() => {
    // The fixture state for this value is (re)created in two situations:
    // 1. Initially: No corresponding fixture state value is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(prevFs => {
      const fsControl = prevFs && prevFs[inputName];
      if (
        fsControl &&
        fsControl.type === 'standard' &&
        fsValueExtendsBaseValue(fsControl.defaultValue, defaultValue)
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
