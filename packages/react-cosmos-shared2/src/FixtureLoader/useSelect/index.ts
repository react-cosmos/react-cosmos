import { SetSelectValue, UseSelectArgs } from './shared';
import { useCreateFixtureState } from './useCreateFixtureState';
import { useCurrentValue } from './useCurrentValue';
import { useSetValue } from './useSetValue';

export function useSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  useCreateFixtureState(selectName, args);
  const currentValue = useCurrentValue(selectName, args);
  const setValue = useSetValue<Option>(selectName);
  return [currentValue, setValue];
}
