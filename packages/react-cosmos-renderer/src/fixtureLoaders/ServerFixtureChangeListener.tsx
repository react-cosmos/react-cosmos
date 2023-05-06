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
  const { rendererId, rendererConnect, searchParams, setSearchParams } =
    React.useContext(RendererContext);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !searchParams.locked &&
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId } = msg.payload;
          if (!isEqual(fixtureId, selectedFixtureId)) {
            setSearchParams({ fixtureId });
          }
        } else if (
          !searchParams.locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setSearchParams({});
        }
      }),
    [
      rendererConnect,
      rendererId,
      searchParams.locked,
      selectedFixtureId,
      setSearchParams,
    ]
  );

  return <>{children}</>;
}
