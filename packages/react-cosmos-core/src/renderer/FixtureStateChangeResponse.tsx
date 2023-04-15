import { isEqual } from 'lodash-es';
import { useEffect, useRef } from 'react';
import { FixtureId } from '../fixture/types.js';
import { FixtureState } from '../fixtureState/types.js';
import { RendererConnect } from './rendererConnectTypes.js';

type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixtureId: FixtureId;
  fixtureState: FixtureState;
};
export function FixtureStateChangeResponse({
  rendererId,
  rendererConnect,
  fixtureId,
  fixtureState,
}: Props) {
  const syncedFixtureState = useRef(fixtureState);

  useEffect(() => {
    if (!isEqual(syncedFixtureState.current, fixtureState)) {
      rendererConnect.postMessage({
        type: 'fixtureStateChange',
        payload: {
          rendererId,
          fixtureId,
          fixtureState,
        },
      });
      syncedFixtureState.current = fixtureState;
    }
  }, [fixtureId, fixtureState, rendererConnect, rendererId]);

  return null;
}
