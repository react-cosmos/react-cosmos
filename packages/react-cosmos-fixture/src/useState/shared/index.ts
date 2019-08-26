import React from 'react';
import {
  extendWithValue,
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueGroups,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { getPersistedValue } from './persistentValueStore';

export type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;

export function getCurrentValue<T extends FixtureStateValueType>(
  fixtureState: FixtureState,
  inputName: string,
  defaultValue: T
): T {
  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return fsValue
    ? // Types of fixture state values cannot be guaranteed at read time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, fsValue.currentValue) as T)
    : // Types of persisted values cannot be guaranteed at read time, which
      // means that tampering with the persisted cache can cause runtime errors
      (getPersistedValue({ inputName, defaultValue }) as T);
}

export function updateCustomState(
  fixtureState: FixtureState,
  updater: (prevCustomState: FixtureStateValueGroups) => FixtureStateValueGroups
): FixtureState {
  return {
    ...fixtureState,
    customState: updater(fixtureState.customState || {})
  };
}
