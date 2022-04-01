import { FixtureStateData } from '../../core/fixtureState/types';
import { SetValue } from './shared';
import { useCreateFixtureState } from './useCreateFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { useSetValue } from './useSetValue';

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
