import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueType
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
    ? // FIXME: Ensure current value in fixture state is of `T` type
      ((fsValue.currentValue as any).value as T)
    : // FIXME: Ensure current value in fixture state is of `T` type
      (getPersistedValue({ inputName, defaultValue }) as T);
}
