'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  selectedFixtureId: FixtureId | null;
};
export function ServerFixtureChangeListener({
  children,
  selectedFixtureId,
}: Props) {
  const { rendererId, rendererConnect, lockedFixture, reloadRenderer } =
    React.useContext(RendererContext);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !lockedFixture &&
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId } = msg.payload;
          if (!isEqual(fixtureId, selectedFixtureId)) {
            reloadRenderer(fixtureId);
          }
        } else if (
          !lockedFixture &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          reloadRenderer(null);
        }
      }),
    [
      lockedFixture,
      reloadRenderer,
      rendererConnect,
      rendererId,
      selectedFixtureId,
    ]
  );

  return <>{children}</>;
}
