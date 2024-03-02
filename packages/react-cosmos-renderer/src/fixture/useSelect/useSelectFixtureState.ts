import { useEffect } from 'react';
import { InputsFixtureState } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { getDefaultSelectValue, UseSelectArgs } from './shared.js';

export function useSelectFixtureState<Option extends string>(
  selectName: string,
  args: UseSelectArgs<Option>
) {
  const [, setFixtureState] = useFixtureState<InputsFixtureState>('inputs');
  const defaultValue = getDefaultSelectValue(args);
  useEffect(() => {
    // The fixture state for this select is (re)created in two situations:
    // 1. Initially: No corresponding fixture state select is found
    // 2: Default value change: Current value is reset to new default value
    setFixtureState(prevFs => {
      const inputFs = prevFs && prevFs[selectName];
      if (
        inputFs &&
        inputFs.type === 'select' &&
        inputFs.defaultValue === defaultValue
      )
        return prevFs;

      return {
        ...prevFs,
        [selectName]: {
          type: 'select',
          options: args.options,
          defaultValue,
          currentValue: defaultValue,
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args.options), defaultValue, selectName, setFixtureState]);
}
