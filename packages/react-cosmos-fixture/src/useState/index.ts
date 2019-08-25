import { FixtureStateValueType } from 'react-cosmos-shared2/fixtureState';
import { useCleanUpFixtureState } from './useCleanUpFixtureState';
import { useCreateOrResetFixtureState } from './useCreateOrResetFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { usePersistFixtureState } from './usePersistFixtureState';
import { useSetValue } from './useSetValue';
import { SetValue } from './shared';

type Opts<T extends FixtureStateValueType> = {
  defaultValue: T;
};

export function useState<T extends FixtureStateValueType>(
  inputName: string,
  { defaultValue }: Opts<T>
): [T, SetValue<T>] {
  useCreateOrResetFixtureState(inputName, defaultValue);
  useCleanUpFixtureState(inputName);
  usePersistFixtureState(defaultValue);
  const currentValue = useCurrentValue(inputName, defaultValue);
  const setValue = useSetValue(inputName, defaultValue);
  return [currentValue, setValue];
}
