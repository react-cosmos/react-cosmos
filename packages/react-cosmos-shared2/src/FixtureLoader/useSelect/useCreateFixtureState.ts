import React, { useEffect } from 'react';
import { findFixtureStateControl } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { getDefaultSelectValue, UseSelectArgs } from './shared';

export function useCreateFixtureState<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
) {
  const { setFixtureState } = React.useContext(FixtureContext);
  const defaultValue = getDefaultSelectValue(args);
  useEffect(() => {
    // The fixture state for this select is (re)created in two situations:
    // 1. Initially: No corresponding fixture state select is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(prevFs => {
      const fsControl = findFixtureStateControl(prevFs, selectName);
      if (
        fsControl &&
        fsControl.type === 'select' &&
        fsControl.defaultValue === defaultValue
      )
        return prevFs;

      return {
        ...prevFs,
        controls: {
          ...prevFs.controls,
          [selectName]: {
            type: 'select',
            options: args.options,
            defaultValue,
            currentValue: defaultValue,
          },
        },
      };
    });
  }, [args.options, defaultValue, selectName, setFixtureState]);
}
