import React from 'react';
import {
  extendWithValue,
  findFixtureStateCustomState,
  FixtureStateValueType
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getPersistedValue } from './shared/persistentValueStore';

export function useCurrentValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): T {
  const { fixtureState } = React.useContext(FixtureContext);
  const fsValueGroup = findFixtureStateCustomState(fixtureState, inputName);
  return fsValueGroup
    ? // Types of fixture state values cannot be guaranteed at read time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, fsValueGroup.currentValue) as T)
    : // Types of persisted values cannot be guaranteed at read time, which
      // means that tampering with the persisted cache can cause runtime errors
      (getPersistedValue({ inputName, defaultValue }) as T);
}
