import { useCurrentValue } from '../useValue/useCurrentValue.js';
import { useSetValue } from '../useValue/useSetValue.js';
import { useValueFixtureState } from '../useValue/useValueFixtureState.js';

export function useCosmosState<T>(
  inputName: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  useValueFixtureState(inputName, defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);

  return [currentValue, setValue];
}
