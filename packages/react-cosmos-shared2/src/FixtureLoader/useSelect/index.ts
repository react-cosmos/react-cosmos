import { SetSelectValue, UseSelectArgs, UseSelectOptions } from './shared';
import { useCreateFixtureState } from './useCreateFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { useSetValue } from './useSetValue';

export function useSelect<Options extends UseSelectOptions>(
  selectName: string,
  args: UseSelectArgs<Options>
): [keyof Options, SetSelectValue<Options>] {
  useCreateFixtureState(selectName, args);
  const currentValue = useCurrentValue(selectName, args);
  const setValue = useSetValue<Options>(selectName);
  return [currentValue, setValue];
}
