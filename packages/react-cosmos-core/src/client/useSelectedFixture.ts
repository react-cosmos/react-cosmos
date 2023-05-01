import { useCallback, useState } from 'react';
import { FixtureState, SetFixtureState } from '../shared/fixtureState/types.js';
import { FixtureId } from '../shared/fixtureTypes.js';

export type SelectedFixture = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  syncedFixtureState: FixtureState;
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
        syncedFixtureState: {},
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
