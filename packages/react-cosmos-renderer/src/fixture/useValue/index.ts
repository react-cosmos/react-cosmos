import { useCreateFixtureState } from './useCreateFixtureState.js';
import { useCurrentValue } from './useCurrentValue.js';
import { useSetValue } from './useSetValue.js';

type Opts<T> = {
  defaultValue: T;
};

export function useValue<T>(
  inputName: string,
  { defaultValue }: Opts<T>
): [T, React.Dispatch<React.SetStateAction<T>>] {
  useCreateFixtureState(inputName, defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);

  return [currentValue, setValue];
}
