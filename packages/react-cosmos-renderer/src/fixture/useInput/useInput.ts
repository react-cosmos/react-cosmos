import { useCurrentInputValue } from './useCurrentInputValue.js';
import { useSetInputValue } from './useSetInputValue.js';
import { useInputFixtureState } from './useValueFixtureState.js';

export function useInput<T>(
  inputName: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  useInputFixtureState(inputName, defaultValue);
  const currentValue = useCurrentInputValue(inputName, defaultValue);
  const setValue = useSetInputValue(inputName, defaultValue);

  return [currentValue, setValue];
}
