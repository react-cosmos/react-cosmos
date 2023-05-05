'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId, stringifyRendererUrlQuery } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  selectedFixtureId: FixtureId | null;
  locked: boolean;
};
export function ServerFixtureChangeListener({
  children,
  selectedFixtureId,
  locked,
}: Props) {
  const { rendererId, rendererConnect } = React.useContext(RendererContext);
  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !locked &&
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId } = msg.payload;
          if (!isEqual(fixtureId, selectedFixtureId)) {
            reloadPage(fixtureId);
          }
        } else if (
          !locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          reloadPage();
        }
      }),
    [locked, rendererConnect, rendererId, selectedFixtureId]
  );

  return <>{children}</>;
}

function reloadPage(fixtureId?: FixtureId) {
  const query = stringifyRendererUrlQuery({ fixtureId });
  window.location.search = query && `?${query}`;
}
