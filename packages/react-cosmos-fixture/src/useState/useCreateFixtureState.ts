import { isEqual } from 'lodash';
import React from 'react';
import {
  createValue,
  extendWithValue,
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValue,
  FixtureStateValueGroups,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';

export function useCreateFixtureState(
  inputName: string,
  defaultValue: FixtureStateValueType
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState(prevFsState => {
      return updateCustomState(prevFsState, customState => {
        // The fixture state for this value is (re)created in two situations:
        // 1. Initially: No corresponding fixture state values is found
        // 2: Default value change: Current value is reset to new default value
        const fsValueGroup = findFixtureStateCustomState(
          prevFsState,
          inputName
        );
        if (
          fsValueGroup &&
          fsValueExtendsBaseValue(fsValueGroup.defaultValue, defaultValue)
        ) {
          return customState;
        }

        return {
          ...customState,
          [inputName]: {
            defaultValue: createValue(defaultValue),
            currentValue: createValue(defaultValue)
          }
        };
      });
    });
  }, [setFixtureState, inputName, defaultValue]);
}

function fsValueExtendsBaseValue(
  fsValue: FixtureStateValue,
  baseValue: unknown
) {
  return isEqual(baseValue, extendWithValue(baseValue, fsValue));
}

function updateCustomState(
  fixtureState: FixtureState,
  updater: (prevCustomState: FixtureStateValueGroups) => FixtureStateValueGroups
): FixtureState {
  return {
    ...fixtureState,
    customState: updater(fixtureState.customState || {})
  };
}
