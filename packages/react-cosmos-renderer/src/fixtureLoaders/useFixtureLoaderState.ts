import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { useRendererMessage } from '../rendererConnect/useRendererMessage.js';

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

  useRendererMessage(
    React.useCallback(
      msg => {
        if (msg.type === 'selectFixture') {
          const { fixtureId, fixtureState } = msg.payload;
          setState(prevState => {
            return {
              fixtureId,
              initialFixtureState: fixtureState,
              renderKey: prevState ? prevState.renderKey + 1 : 0,
            };
          });
        } else if (msg.type === 'unselectFixture') {
          setState(null);
        }
      },
      [setState]
    )
  );

  return state;
}
