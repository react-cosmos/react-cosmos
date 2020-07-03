import React, { useEffect } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getDefaultSelectValue, UseSelectArgs } from './shared';

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
      const defaultValue = getDefaultSelectValue(args);
      const fsSelect = findFixtureStateSelect(prevFsState, selectName);
      if (fsSelect && fsSelect.defaultValue === defaultValue)
        return prevFsState;

      const { options } = args;
      return {
        ...prevFsState,
        selects: {
          ...prevFsState.selects,
          [selectName]: {
            options,
            defaultValue,
            currentValue: defaultValue,
          },
        },
      };
    });
  }, [args, selectName, setFixtureState]);
}
