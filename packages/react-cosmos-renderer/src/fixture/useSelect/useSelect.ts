import { SetSelectValue, UseSelectArgs } from './shared.js';
import { useCurrentSelectValue } from './useCurrentSelectValue.js';
import { useSelectFixtureState } from './useSelectFixtureState.js';
import { useSetSelectValue } from './useSetSelectValue.js';

export function useSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  if (!args || !args.options || !args.options.length)
    throw new Error('No options provided to useSelect');

  if (typeof args.options[0] === 'object') {
    if (!args.options[0].options.length)
      throw new Error('No options provided to useSelect');
  }

  useSelectFixtureState(selectName, args);
  const currentValue = useCurrentSelectValue(selectName, args);
  const setValue = useSetSelectValue<Option>(selectName);

  return [currentValue, setValue];
}
