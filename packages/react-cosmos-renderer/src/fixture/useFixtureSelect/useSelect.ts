import { SetSelectValue, UseSelectArgs } from './shared.js';
import { useFixtureSelect } from './useFixtureSelect.js';

// NOTE: This is an alias for useFixtureSelect kept for backwards compatibility
// with Cosmos versions older than 6.1
export function useSelect<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): [Option, SetSelectValue<Option>] {
  return useFixtureSelect(selectName, args);
}
