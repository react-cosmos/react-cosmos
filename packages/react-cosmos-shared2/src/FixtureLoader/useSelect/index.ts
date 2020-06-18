import { SetSelectValue, UseSelectArgs, UseSelectOptions } from './shared';
import { useCreateFixtureState } from './useCreateFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { useSetValue } from './useSetValue';

export function useSelect<O extends UseSelectOptions>(
  selectName: string,
  args: UseSelectArgs<O>
): [keyof O, SetSelectValue<O>] {
  useCreateFixtureState(selectName, args);
  const currentValue = useCurrentValue(selectName, args);
  const setValue = useSetValue<O>(selectName);
  return [currentValue, setValue];
}
