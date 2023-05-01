import { isEqual } from 'lodash-es';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { RendererConnect } from 'react-cosmos-core';
import { SelectedFixture } from './useSelectedFixture.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  selectedFixture: SelectedFixture;
  setSelectedFixture: Dispatch<SetStateAction<SelectedFixture | null>>;
};
export function FixtureStateChangeResponse({
  rendererId,
  rendererConnect,
  selectedFixture,
  setSelectedFixture,
}: Props) {
  const { fixtureId, fixtureState, syncedFixtureState } = selectedFixture;

  useEffect(() => {
    if (!isEqual(fixtureState, syncedFixtureState)) {
      rendererConnect.postMessage({
        type: 'fixtureStateChange',
        payload: {
          rendererId,
          fixtureId,
          fixtureState,
        },
      });
      setSelectedFixture(prev => {
        // Ensure fixture state applies to currently selected fixture
        if (prev && isEqual(prev.fixtureId, fixtureId)) {
          return { ...prev, syncedFixtureState: fixtureState };
        } else {
          return prev;
        }
      });
    }
  }, [
    fixtureId,
    fixtureState,
    rendererConnect,
    rendererId,
    setSelectedFixture,
    syncedFixtureState,
  ]);

  return null;
}
