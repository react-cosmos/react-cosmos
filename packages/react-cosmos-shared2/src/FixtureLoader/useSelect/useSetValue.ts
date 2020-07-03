import { useCallback, useContext } from 'react';
import { findFixtureStateSelect } from '../../fixtureState';
import { FixtureContext } from '../FixtureContext';
import { SetSelectValue } from './shared';

export function useSetValue<Option extends string>(
  selectName: string
): SetSelectValue<Option> {
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
              currentValue: value,
            },
          },
        };
      });
    },
    [selectName, setFixtureState]
  );
}
