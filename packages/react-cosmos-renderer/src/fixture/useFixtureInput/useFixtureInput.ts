import { Dispatch, SetStateAction } from 'react-cosmos-core';
import { useCurrentInputValue } from './useCurrentInputValue.js';
import { useInputFixtureState } from './useInputFixtureState.js';
import { useSetInputValue } from './useSetInputValue.js';

export function useFixtureInput<T>(
  inputName: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  useInputFixtureState(inputName, defaultValue);
  const currentValue = useCurrentInputValue(inputName, defaultValue);
  const setValue = useSetInputValue(inputName, defaultValue);

  return [currentValue, setValue];
}
