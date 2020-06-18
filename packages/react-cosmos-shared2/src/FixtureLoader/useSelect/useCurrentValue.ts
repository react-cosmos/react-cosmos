import { useContext } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { UseSelectArgs, UseSelectOptions } from './shared';

export function useCurrentValue<O extends UseSelectOptions>(
  selectName: string,
  args: UseSelectArgs<O>
): keyof O {
  const { fixtureState } = useContext(FixtureContext);
  const fsSelect = findFixtureStateSelect(fixtureState, selectName);
  return fsSelect ? fsSelect.currentValue : args.defaultValue;
}
