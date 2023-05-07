'use client';
import React from 'react';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
};
export function ServerFixtureChangeListener({ children }: Props) {
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
          setSearchParams({ fixtureId });
        } else if (
          !searchParams.locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setSearchParams({});
        }
      }),
    [rendererConnect, rendererId, searchParams.locked, setSearchParams]
  );

  return <>{children}</>;
}
