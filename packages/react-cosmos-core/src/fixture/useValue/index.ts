import { FixtureStateData } from '../../fixtureState/types.js';
import { SetValue } from './shared.js';
import { useCreateFixtureState } from './useCreateFixtureState.js';
import { useCurrentValue } from './useCurrentValue.js';
import { useSetValue } from './useSetValue.js';

type Opts<T extends FixtureStateData> = {
  defaultValue: T;
};

export function useValue<T extends FixtureStateData>(
  inputName: string,
  { defaultValue }: Opts<T>
): [T, SetValue<T>] {
  useCreateFixtureState(inputName, defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);
  return [currentValue, setValue];
}
