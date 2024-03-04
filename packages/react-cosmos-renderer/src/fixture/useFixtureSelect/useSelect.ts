import { SetSelectValue, UseSelectArgs } from './shared.js';
import { useFixtureSelect } from './useFixtureSelect.js';

export function useSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  return useFixtureSelect(selectName, args);
}
