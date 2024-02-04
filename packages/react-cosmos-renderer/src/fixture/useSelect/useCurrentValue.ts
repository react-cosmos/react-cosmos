import { ControlsFixtureState } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { getDefaultSelectValue, UseSelectArgs } from './shared.js';

export function useCurrentValue<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): Option {
  const [fixtureState] = useFixtureState<ControlsFixtureState>('controls');
  const controlFs = fixtureState && fixtureState[selectName];
  return controlFs && controlFs.type === 'select'
    ? (controlFs.currentValue as Option)
    : getDefaultSelectValue(args);
}
