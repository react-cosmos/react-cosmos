import React from 'react';
import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';
import { useCleanUpFixtureState } from './useCleanUpFixtureState';
import { useCreateOrResetFixtureState } from './useCreateOrResetFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { usePersistFixtureState } from './usePersistFixtureState';
import { useSetValue } from './useSetValue';

type SetValue<T extends FixtureStateValueType> = React.Dispatch<
  React.SetStateAction<T>
>;

export function useValue<T extends FixtureStateValueType>(
  inputName: string,
  defaultValue: T
): [T, SetValue<T>] {
  useCreateOrResetFixtureState(inputName, defaultValue);
  useCleanUpFixtureState(inputName);
  usePersistFixtureState();
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);
  return [currentValue, setValue];
}
