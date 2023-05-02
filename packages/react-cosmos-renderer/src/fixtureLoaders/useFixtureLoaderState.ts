import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { RendererConnectContext } from '../rendererConnect/RendererConnectContext.js';

export type FixtureLoaderSelection = {
  fixtureId: FixtureId;
  initialFixtureState: FixtureState;
  renderKey: number;
};

export function useFixtureLoaderState(
  initialFixtureId: FixtureId | null,
  selectedFixtureId: FixtureId | null
) {
  const [state, setState] = React.useState<FixtureLoaderSelection | null>(
    () => {
      const fixtureId = selectedFixtureId ?? initialFixtureId;
      if (!fixtureId) return null;

      return {
        fixtureId,
        initialFixtureState: {},
        renderKey: 0,
      };
    }
  );

  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId, fixtureState } = msg.payload;
          setState(prevState => {
            return {
              fixtureId,
              initialFixtureState: fixtureState,
              renderKey: prevState ? prevState.renderKey + 1 : 0,
            };
          });
        } else if (
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setState(null);
        }
      }),
    [rendererConnect, rendererId]
  );

  return state;
}
