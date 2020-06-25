import { useCallback, useContext } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetSelectValue, UseSelectOptions } from './shared';

export function useSetValue<Options extends UseSelectOptions>(
  selectName: string
): SetSelectValue<Options> {
  const { setFixtureState } = useContext(FixtureContext);
  return useCallback(
    value => {
      setFixtureState(prevFsState => {
        const fsSelect = findFixtureStateSelect(prevFsState, selectName);
        if (!fsSelect)
          throw new Error(
            `Fixture state select missing for name: ${selectName}`
          );

        return {
          ...prevFsState,
          selects: {
            ...prevFsState.selects,
            [selectName]: {
              ...fsSelect,
              currentValue: value as string,
            },
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
