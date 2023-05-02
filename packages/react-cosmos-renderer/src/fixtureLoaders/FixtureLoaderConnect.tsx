'use client';
import React from 'react';
import { FixtureId, FixtureList } from 'react-cosmos-core';
import { RendererConnectContext } from '../rendererConnect/RendererConnectContext.js';

type Props = {
  children: React.ReactNode;
  fixtures: FixtureList;
  initialFixtureId: FixtureId | null;
};
export function FixtureLoaderConnect({
  children,
  fixtures,
  initialFixtureId,
}: Props) {
  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );

  const readyRef = React.useRef(false);
  React.useEffect(() => {
    if (readyRef.current) {
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: { rendererId, fixtures },
      });
    } else {
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: initialFixtureId
          ? { rendererId, fixtures, initialFixtureId }
          : { rendererId, fixtures },
      });
      readyRef.current = true;
    }
  }, [fixtures, initialFixtureId, rendererConnect, rendererId]);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (msg.type === 'pingRenderers') {
          rendererConnect.postMessage({
            type: 'rendererReady',
            payload: { rendererId, fixtures },
          });
        }
      }),
    [fixtures, rendererConnect, rendererId]
  );

  return <>{children}</>;
}
