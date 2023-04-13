import { useCallback, useState } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';

export type SelectedFixture = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  renderKey: number;
};

export function useSelectedFixture(
  initialFixtureId?: FixtureId,
  selectedFixtureId?: null | FixtureId
) {
  const [selectedFixture, setSelectedFixture] =
    useState<SelectedFixture | null>(() => {
      const fixtureId = selectedFixtureId ?? initialFixtureId;
      if (!fixtureId) return null;

      return {
        fixtureId,
        fixtureState: {},
        renderKey: 0,
      };
    });

  const setFixtureState = useCallback<SetFixtureState>(
    stateUpdate => {
      setSelectedFixture(prevState => {
        if (!prevState) {
          console.warn('Trying to set fixture state with no fixture selected');
          return null;
        }

        return {
          ...prevState,
          fixtureState: stateUpdate(prevState.fixtureState),
        };
      });
    },
    [setSelectedFixture]
  );

  return {
    selectedFixture,
    setSelectedFixture,
    setFixtureState,
  };
}
