import React from 'react';
import {
  findFixtureStateCustomState,
  FixtureState,
  FixtureStateValueGroups,
  FixtureStateValueType,
  FixtureStateObjectValueType
} from 'react-cosmos-shared2/fixtureState';
import { getPersistedValue } from './persistentValueStore';

export type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isObject(value: unknown): value is FixtureStateObjectValueType {
  return value !== null && typeof value === 'object';
}

// TODO: isArray

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
