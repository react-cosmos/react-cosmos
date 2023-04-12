import { useCallback, useState } from 'react';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';

export type SelectedFixture = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
};

export function useSelectedFixture(
  initialFixtureId?: FixtureId,
  selectedFixtureId?: null | FixtureId
) {
  const [selectedFixture, setSelectedFixture] =
    useState<SelectedFixture | null>(() => {
      if (!selectedFixtureId) return null;

      return {
        fixtureId: selectedFixtureId || initialFixtureId,
        fixtureState: {},
      };
    });

  const fixtureSelected = selectedFixture !== null;
  const setFixtureState = useCallback<SetFixtureState>(
    stateUpdate => {
      if (!fixtureSelected) {
        console.warn(
          '[FixtureLoader] Trying to set fixture state with no fixture selected'
        );
        return;
      }

      // Multiple state changes can be dispatched by fixture plugins at almost
      // the same time. Since state changes are batched in React, current state
      // (this.state.fixtureState) can be stale at dispatch time, and extending
      // it can result in cancelling previous state changes that are queued.
      // Using an updater function like ({ prevState }) => nextState ensures
      // every state change is honored, regardless of timing.
      setSelectedFixture(prevState => {
        if (!prevState) return null;

        return {
          ...prevState,
          fixtureState: stateUpdate(prevState.fixtureState),
        };
      });
    },
    [fixtureSelected, setSelectedFixture]
  );

  return {
    selectedFixture,
    setSelectedFixture,
    setFixtureState,
  };
}
