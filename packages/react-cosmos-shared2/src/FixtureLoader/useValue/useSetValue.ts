import React from 'react';
import {
  createValue,
  extendWithValue,
  findFixtureStateControl,
  FixtureState,
  FixtureStateValueType,
} from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetValue } from './shared';

export function useSetValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): SetValue<T> {
  const { setFixtureState } = React.useContext(FixtureContext);
  return React.useCallback(
    stateChange => {
      setFixtureState(fsState => {
        const currentValue: FixtureStateValueType =
          typeof stateChange === 'function'
            ? stateChange(
                // Types of fixture state values cannot be guaranteed at read
                // time, which means that tampering with the fixture state can
                // cause runtime errors
                getCurrentValueFromFixtureState(
                  fsState,
                  inputName,
                  defaultValue
                ) as T
              )
            : stateChange;

        return {
          ...fsState,
          controls: {
            ...fsState.controls,
            [inputName]: {
              type: 'standard',
              defaultValue: createValue(defaultValue),
              currentValue: createValue(currentValue),
            },
          },
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
  const fsControl = findFixtureStateControl(fsState, inputName);
  return fsControl && fsControl.type === 'standard'
    ? extendWithValue(defaultValue, fsControl.currentValue)
    : defaultValue;
}
