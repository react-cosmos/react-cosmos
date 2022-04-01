import React from 'react';
import { findFixtureStateControl } from '../../core/fixtureState/controls';
import { createValue } from '../../core/fixtureState/createValues';
import { extendWithValue } from '../../core/fixtureState/extendWithValues';
import { FixtureState, FixtureStateData } from '../../core/fixtureState/types';
import { FixtureContext } from '../FixtureContext';
import { SetValue } from './shared';

export function useSetValue<T extends FixtureStateData>(
  inputName: string,
  defaultValue: T
): SetValue<T> {
  const { setFixtureState } = React.useContext(FixtureContext);
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
          controls: {
            ...prevFs.controls,
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
  fixtureState: FixtureState,
  inputName: string,
  defaultValue: FixtureStateData
): unknown {
  const fsControl = findFixtureStateControl(fixtureState, inputName);
  return fsControl && fsControl.type === 'standard'
    ? extendWithValue(defaultValue, fsControl.currentValue)
    : defaultValue;
}