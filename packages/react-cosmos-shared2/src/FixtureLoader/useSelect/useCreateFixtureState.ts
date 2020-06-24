import React, { useEffect } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { UseSelectArgs, UseSelectOptions } from './shared';

export function useCreateFixtureState<Options extends UseSelectOptions>(
  selectName: string,
  args: UseSelectArgs<Options>
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  useEffect(() => {
    // The fixture state for this select is (re)created in two situations:
    // 1. Initially: No corresponding fixture state select is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(prevFsState => {
      const fsSelect = findFixtureStateSelect(prevFsState, selectName);
      if (fsSelect && fsSelect.defaultValue === args.defaultValue)
        return prevFsState;

      return {
        ...prevFsState,
        selects: {
          ...prevFsState.selects,
          [selectName]: {
            options: Object.keys(args.options),
            defaultValue: args.defaultValue as string,
            currentValue: args.defaultValue as string,
          },
        },
      };
    });
  }, [args.defaultValue, args.options, selectName, setFixtureState]);
}
