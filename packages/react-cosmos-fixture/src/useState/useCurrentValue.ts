import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueType,
  extendWithValue
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getPersistedValue } from './shared/persistentValueStore';

export function useCurrentValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): T {
  const { fixtureState } = React.useContext(FixtureContext);
  return getCurrentValue(fixtureState, inputName, defaultValue);
}

function getCurrentValue<T extends FixtureStateValueType>(
  fixtureState: FixtureState,
  inputName: string,
  defaultValue: T
): T {
  const fsValue = findFixtureStateCustomState(fixtureState, inputName);
  return fsValue
    ? // Types cannot be enforced in fixture state values, which means that
      // tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, fsValue.currentValue) as T)
    : // Types cannot be enforced in persisted values cache, which means that
      // tampering with the persisted values cache can cause runtime errors
      (getPersistedValue({ inputName, defaultValue }) as T);
}
