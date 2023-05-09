import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

export type FixtureSelection = {
  fixtureId: FixtureId;
  initialFixtureState: FixtureState;
  renderKey: number;
};

export function useFixtureSelection() {
  const { rendererId, rendererConnect, params } =
    React.useContext(RendererContext);

  const { fixtureId: selectedFixtureId = null } = params;

  const [selection, setSelection] = React.useState<FixtureSelection | null>(
    () =>
      selectedFixtureId && {
        fixtureId: selectedFixtureId,
        initialFixtureState: {},
        renderKey: 0,
      }
  );

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !params.locked &&
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
          !params.locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setSelection(null);
        }
      }),
    [params.locked, rendererConnect, rendererId]
  );

  return selection;
}
