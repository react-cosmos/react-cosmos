import React from 'react';
import {
  FixtureStateControls,
  FixtureStateData,
  createValue,
  extendWithValue,
} from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { SetValue } from './shared.js';

export function useSetValue<T extends FixtureStateData>(
  inputName: string,
  defaultValue: T
): SetValue<T> {
  const [, setFixtureState] = useFixtureState<FixtureStateControls>('controls');
  return React.useCallback(
    stateChange => {
      setFixtureState(prevFs => {
        const currentValue: FixtureStateData =
          typeof stateChange === 'function'
            ? stateChange(
                // Types of fixture state values cannot be guaranteed at read
                // time, which means that tampering with the fixture state can
                // cause runtime errors
                getCurrentValueFromFixtureState(
                  prevFs,
                  inputName,
                  defaultValue
                ) as T
              )
            : stateChange;

        return {
          ...prevFs,
          [inputName]: {
            type: 'standard',
            defaultValue: createValue(defaultValue),
            currentValue: createValue(currentValue),
          },
        };
      });
    },
    [setFixtureState, defaultValue, inputName]
  );
}

function getCurrentValueFromFixtureState(
  fixtureState: FixtureStateControls | undefined,
  inputName: string,
  defaultValue: FixtureStateData
) {
  const fsControl = fixtureState && fixtureState[inputName];
  return fsControl && fsControl.type === 'standard'
    ? extendWithValue(defaultValue, fsControl.currentValue)
    : defaultValue;
}
