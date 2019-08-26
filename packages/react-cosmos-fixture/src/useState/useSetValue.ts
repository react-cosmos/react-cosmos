import React from 'react';
import {
  createValue,
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueType,
  extendWithValue
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetValue } from './shared';

export function useSetValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): SetValue<T> {
  const { setFixtureState } = React.useContext(FixtureContext);
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFsState => {
        const currentValue: FixtureStateValueType =
          typeof stateChange === 'function'
            ? stateChange(
                // Types of fixture state values cannot be guaranteed at read
                // time, which means that tampering with the fixture state can
                // cause runtime errors
                getCurrentValueFromFixtureState(
                  prevFsState,
                  inputName,
                  defaultValue
                ) as T
              )
            : stateChange;
        return {
          ...prevFsState,
          customState: {
            ...prevFsState.customState,
            [inputName]: {
              defaultValue: createValue(defaultValue),
              currentValue: createValue(currentValue)
            }
          }
        };
      });
    },
    [setFixtureState, defaultValue, inputName]
  );
}

function getCurrentValueFromFixtureState(
  fsState: FixtureState,
  inputName: string,
  defaultValue: FixtureStateValueType
): unknown {
  const fsValue = findFixtureStateCustomState(fsState, inputName);
  if (!fsValue)
    throw new Error(`Fixture state value missing for input name: ${inputName}`);

  return extendWithValue(defaultValue, fsValue.currentValue);
}
