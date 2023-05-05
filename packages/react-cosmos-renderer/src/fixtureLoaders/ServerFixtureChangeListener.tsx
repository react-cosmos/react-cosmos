'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId } from 'react-cosmos-core';
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
  const { rendererId, rendererConnect, reloadFixture } =
    React.useContext(RendererContext);

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
            reloadFixture(fixtureId);
          }
        } else if (
          !locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          reloadFixture(null);
        }
      }),
    [locked, reloadFixture, rendererConnect, rendererId, selectedFixtureId]
  );

  return <>{children}</>;
}
