import { useContext } from 'react';
import { findFixtureStateControl } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getDefaultSelectValue, UseSelectArgs } from './shared';

export function useCurrentValue<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): Option {
  const { fixtureState } = useContext(FixtureContext);
  const fsControl = findFixtureStateControl(fixtureState, selectName);
  return fsControl && fsControl.type === 'select'
    ? (fsControl.currentValue as Option)
    : getDefaultSelectValue(args);
}
