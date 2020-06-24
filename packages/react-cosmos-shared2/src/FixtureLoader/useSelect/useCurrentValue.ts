import { useContext } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { UseSelectArgs, UseSelectOptions } from './shared';

export function useCurrentValue<Options extends UseSelectOptions>(
  selectName: string,
  args: UseSelectArgs<Options>
): keyof Options {
  const { fixtureState } = useContext(FixtureContext);
  const fsSelect = findFixtureStateSelect(fixtureState, selectName);
  return fsSelect ? fsSelect.currentValue : args.defaultValue;
}
