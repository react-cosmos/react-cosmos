import { useCurrentValue } from './useCurrentValue.js';
import { useSetValue } from './useSetValue.js';
import { useValueFixtureState } from './useValueFixtureState.js';

type Opts<T> = {
  defaultValue: T;
};

export function useValue<T>(
  inputName: string,
  { defaultValue }: Opts<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  useValueFixtureState(inputName, defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);

  return [currentValue, setValue];
}
