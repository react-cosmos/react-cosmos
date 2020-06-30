import { useContext } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { UseSelectArgs } from './shared';

export function useCurrentValue<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
): Option {
  const { fixtureState } = useContext(FixtureContext);
  const fsSelect = findFixtureStateSelect(fixtureState, selectName);
  return fsSelect ? (fsSelect.currentValue as Option) : args.defaultValue;
}
