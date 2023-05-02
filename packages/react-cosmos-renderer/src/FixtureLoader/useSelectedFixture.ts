import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { useRendererMessage } from '../shared/useRendererMessage.js';

export type SelectedFixtureState = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  renderKey: number;
};

export function useSelectedFixture(
  initialFixtureId: FixtureId | null,
  selectedFixtureId: FixtureId | null
) {
  const [state, setState] = React.useState<SelectedFixtureState | null>(() => {
    const fixtureId = selectedFixtureId ?? initialFixtureId;
    if (!fixtureId) return null;

    return {
      fixtureId,
      fixtureState: {},
      renderKey: 0,
    };
  });

  useRendererMessage(
    React.useCallback(
      msg => {
        if (msg.type === 'selectFixture') {
          const { fixtureId, fixtureState } = msg.payload;
          setState(prevState => {
            return {
              fixtureId,
              fixtureState,
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
