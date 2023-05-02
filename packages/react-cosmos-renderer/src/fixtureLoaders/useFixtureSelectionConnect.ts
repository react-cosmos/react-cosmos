import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

export type FixtureSelection = {
  fixtureId: FixtureId;
  initialFixtureState: FixtureState;
  renderKey: number;
};

export function useFixtureSelectionConnect(
  initialFixtureId: FixtureId | null,
  selectedFixtureId: FixtureId | null
) {
  const [selection, setSelection] = React.useState<FixtureSelection | null>(
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

  const { rendererId, rendererConnect } = React.useContext(RendererContext);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId, fixtureState } = msg.payload;
          setSelection(prevState => {
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
          setSelection(null);
        }
      }),
    [rendererConnect, rendererId]
  );

  return selection;
}
