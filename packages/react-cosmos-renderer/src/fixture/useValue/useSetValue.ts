import React from 'react';
import {
  InputsFixtureState,
  createValue,
  extendWithValue,
} from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useSetValue<T>(
  inputName: string,
  defaultValue: T
): React.Dispatch<React.SetStateAction<T>> {
  const [, setFixtureState] = useFixtureState<InputsFixtureState>('inputs');
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFs => {
        // Types of fixture state values cannot be guaranteed at run
        // time, which means that tampering with the fixture state can
        // cause runtime errors
        function getNewState() {
          if (typeof stateChange !== 'function') return stateChange;

          const stateUpdater = stateChange as (prevState: unknown) => unknown;
          return stateUpdater(
            getCurrentValueFromFixtureState(prevFs, inputName, defaultValue)
          );
        }

        return {
          ...prevFs,
          [inputName]: {
            type: 'standard',
            defaultValue: createValue(defaultValue),
            currentValue: createValue(getNewState()),
          },
        };
      });
    },
    [setFixtureState, defaultValue, inputName]
  );
}

function getCurrentValueFromFixtureState(
  fixtureState: InputsFixtureState | undefined,
  inputName: string,
  defaultValue: unknown
) {
  const inputFs = fixtureState && fixtureState[inputName];
  return inputFs && inputFs.type === 'standard'
    ? extendWithValue(defaultValue, inputFs.currentValue)
    : defaultValue;
}
