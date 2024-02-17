import { useCallback } from 'react';
import { ControlsFixtureState } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';
import { SetSelectValue } from './shared.js';

export function useSetSelectValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
  const [, setFixtureState] = useFixtureState<ControlsFixtureState>('controls');
  return useCallback(
    value => {
      setFixtureState(prevFs => {
        const controlFs = prevFs && prevFs[selectName];
        if (!controlFs || controlFs.type !== 'select') {
          console.warn(`Invalid fixture state for select: ${selectName}`);
          return prevFs ?? {};
        }

        return {
          ...prevFs,
          [selectName]: {
            ...controlFs,
            currentValue: value,
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
