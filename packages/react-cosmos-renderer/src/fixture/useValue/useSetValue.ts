import React from 'react';
import {
  ControlsFixtureState,
  FixtureStateData,
  createValue,
  extendWithValue,
} from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useSetValue<T>(
  inputName: string,
  defaultValue: T
): React.Dispatch<React.SetStateAction<T>> {
  const [, setFixtureState] = useFixtureState<ControlsFixtureState>('controls');
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFs => {
        // Types of fixture state values cannot be guaranteed at read
        // time, which means that tampering with the fixture state can
        // cause runtime errors
        // TODO: Explain the type coercion better
        function getNewState() {
          if (typeof stateChange !== 'function') {
            return stateChange as FixtureStateData;
          }

          const stateUpdater = stateChange as (
            prevState: unknown
          ) => FixtureStateData;

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
  fixtureState: ControlsFixtureState | undefined,
  inputName: string,
  defaultValue: unknown
) {
  const controlFs = fixtureState && fixtureState[inputName];
  return controlFs && controlFs.type === 'standard'
    ? extendWithValue(defaultValue, controlFs.currentValue)
    : defaultValue;
}
