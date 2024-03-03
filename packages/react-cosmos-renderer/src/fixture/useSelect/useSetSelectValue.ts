import { useCallback } from 'react';
import { InputsFixtureState } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { SetSelectValue } from './shared.js';

export function useSetSelectValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
  const [, setFixtureState] = useFixtureState<InputsFixtureState>('inputs');
  return useCallback(
    value => {
      setFixtureState(prevFs => {
        const inputFs = prevFs && prevFs[selectName];
        if (!inputFs || inputFs.type !== 'select') {
          console.warn(`Invalid fixture state for select: ${selectName}`);
          return prevFs ?? {};
        }

        return {
          ...prevFs,
          [selectName]: {
            ...inputFs,
            currentValue: value,
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
