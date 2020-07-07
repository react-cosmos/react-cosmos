import { useCallback, useContext } from 'react';
import { findFixtureStateControl } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetSelectValue } from './shared';

export function useSetValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
  const { setFixtureState } = useContext(FixtureContext);
  return useCallback(
    value => {
      setFixtureState(fsState => {
        const fsControl = findFixtureStateControl(fsState, selectName);
        if (!fsControl || fsControl.type !== 'select') {
          console.warn(`Invalid fixture state for select: ${selectName}`);
          return fsState;
        }

        return {
          ...fsState,
          controls: {
            ...fsState.controls,
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
