import React, { useEffect } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { UseSelectArgs } from './shared';

export function useCreateFixtureState<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
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

      const options = Array.isArray(args.options)
        ? args.options
        : Object.keys(args.options);
      return {
        ...prevFsState,
        selects: {
          ...prevFsState.selects,
          [selectName]: {
            options,
            defaultValue: args.defaultValue,
            currentValue: args.defaultValue,
          },
        },
      };
    });
  }, [args.defaultValue, args.options, selectName, setFixtureState]);
}
