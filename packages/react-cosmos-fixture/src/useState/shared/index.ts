import React from 'react';
import {
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
    ? // FIXME: Ensure current value in fixture state is of `T` type
      ((fsValue.currentValue as any).value as T)
    : // FIXME: Ensure current value in fixture state is of `T` type
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
