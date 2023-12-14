import { useCallback } from 'react';
import { FixtureStateControls } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { SetSelectValue } from './shared.js';

export function useSetValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
  const [, setFixtureState] = useFixtureState<FixtureStateControls>('controls');
  return useCallback(
    value => {
      setFixtureState(prevFs => {
        const fsControl = prevFs && prevFs[selectName];
        if (!fsControl || fsControl.type !== 'select') {
          console.warn(`Invalid fixture state for select: ${selectName}`);
          return prevFs;
        }

        return {
          ...prevFs,
          [selectName]: {
            ...fsControl,
            currentValue: value,
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
