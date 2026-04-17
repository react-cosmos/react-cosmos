import type { InputsFixtureState } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import type { UseSelectArgs } from './shared.js';
import { getDefaultSelectValue } from './shared.js';

export function useCurrentSelectValue<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): Option {
  const [fixtureState] = useFixtureState<InputsFixtureState>('inputs');
  const inputFs = fixtureState && fixtureState[selectName];
  return inputFs && inputFs.type === 'select'
    ? (inputFs.currentValue as Option)
    : getDefaultSelectValue(args);
}
