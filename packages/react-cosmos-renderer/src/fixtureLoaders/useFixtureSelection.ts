import React from 'react';
import { FixtureId, FixtureState } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

export type FixtureSelection = {
  fixtureId: FixtureId;
  initialFixtureState: FixtureState;
  renderKey: number;
};

export function useFixtureSelection(
  initialFixtureId: FixtureId | null,
  locked: boolean
) {
  const [selection, setSelection] = React.useState<FixtureSelection | null>(
    () => {
      return (
        initialFixtureId && {
          fixtureId: initialFixtureId,
          initialFixtureState: {},
          renderKey: 0,
        }
      );
    }
  );

  const { rendererConfig, rendererId, rendererConnect, reloadFixture } =
    React.useContext(RendererContext);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !locked &&
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId, fixtureState } = msg.payload;
          if (rendererConfig.reloadOnFixtureChange) {
            reloadFixture(fixtureId);
          } else {
            setSelection(prevState => {
              return {
                fixtureId,
                initialFixtureState: fixtureState,
                renderKey: prevState ? prevState.renderKey + 1 : 0,
              };
            });
          }
        } else if (
          !locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setSelection(null);
        }
      }),
    [
      locked,
      reloadFixture,
      rendererConfig.reloadOnFixtureChange,
      rendererConnect,
      rendererId,
    ]
  );

  return selection;
}
