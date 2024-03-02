import { SetSelectValue, UseSelectArgs } from './shared.js';
import { useSelect } from './useSelect.js';

// TODO: Make this the primary implementation and deprecate useSelect
export function useCosmosSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  return useSelect(selectName, args);
}
