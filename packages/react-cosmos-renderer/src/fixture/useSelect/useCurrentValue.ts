import { FixtureStateControls } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { getDefaultSelectValue, UseSelectArgs } from './shared.js';

export function useCurrentValue<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): Option {
  const [fixtureState] = useFixtureState<FixtureStateControls>('controls');
  const fsControl = fixtureState && fixtureState[selectName];
  return fsControl && fsControl.type === 'select'
    ? (fsControl.currentValue as Option)
    : getDefaultSelectValue(args);
}
