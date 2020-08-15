import React from 'react';
import {
  extendWithValue,
  findFixtureStateControl,
  FixtureStateValueData,
} from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';

export function useCurrentValue<T extends FixtureStateValueData>(
  inputName: string,
  defaultValue: T
): T {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsControl = findFixtureStateControl(fixtureState, inputName);
  return fsControl && fsControl.type === 'standard'
    ? // Types of fixture state values cannot be guaranteed at read time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, fsControl.currentValue) as T)
    : defaultValue;
}
