'use client';
import React from 'react';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
};
export function ServerFixtureChangeListener({ children }: Props) {
  const { rendererId, rendererConnect, params, setParams } =
    React.useContext(RendererContext);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          !params.locked &&
          msg.type === 'selectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId } = msg.payload;
          setParams({
            fixtureId,
            key: (params.key ?? 0) + 1,
          });
        } else if (
          !params.locked &&
          msg.type === 'unselectFixture' &&
          msg.payload.rendererId === rendererId
        ) {
          setParams({});
        }
      }),
    [params.key, params.locked, rendererConnect, rendererId, setParams]
  );

  return <>{children}</>;
}
