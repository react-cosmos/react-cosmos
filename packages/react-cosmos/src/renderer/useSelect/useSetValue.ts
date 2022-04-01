import { useCallback, useContext } from 'react';
import { findFixtureStateControl } from '../../core/fixtureState/controls';
import { FixtureContext } from '../FixtureContext';
import { SetSelectValue } from './shared';

export function useSetValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
  const { setFixtureState } = useContext(FixtureContext);
  return useCallback(
    value => {
      setFixtureState(prevFs => {
        const fsControl = findFixtureStateControl(prevFs, selectName);
        if (!fsControl || fsControl.type !== 'select') {
          console.warn(`Invalid fixture state for select: ${selectName}`);
          return prevFs;
        }

        return {
          ...prevFs,
          controls: {
            ...prevFs.controls,
            [selectName]: {
              ...fsControl,
              currentValue: value,
            },
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
