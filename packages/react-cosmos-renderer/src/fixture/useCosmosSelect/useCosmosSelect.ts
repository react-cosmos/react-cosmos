import { useValue } from '../useValue/useValue.js';

export function useCosmosSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  return useSelect(selectName, args);
}
