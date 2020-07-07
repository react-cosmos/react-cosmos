import { isEqual } from 'lodash';
import React from 'react';
import {
  createValue,
  extendWithValue,
  findFixtureStateControl,
  FixtureStateValue,
  FixtureStateValueType,
} from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';

export function useCreateFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    // The fixture state for this value is (re)created in two situations:
    // 1. Initially: No corresponding fixture state value is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(fsState => {
      const fsControl = findFixtureStateControl(fsState, inputName);
      if (
        fsControl &&
        fsControl.type === 'standard' &&
        fsValueExtendsBaseValue(fsControl.defaultValue, defaultValue)
      )
        return fsState;

      return {
        ...fsState,
        controls: {
          ...fsState.controls,
          [inputName]: {
            type: 'standard',
            defaultValue: createValue(defaultValue),
            currentValue: createValue(defaultValue),
          },
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
