'use client';
import React from 'react';
import { FixtureId, FixtureList } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  fixtures: FixtureList;
  initialFixtureId?: FixtureId | null;
};
export function FixtureListRendererResponse({
  children,
  fixtures,
  initialFixtureId = null,
}: Props) {
  const { rendererId, rendererConnect } = React.useContext(RendererContext);

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
          ? // TODO: Could this initialFixtureId be driven by selectedFixtureId?
            { rendererId, fixtures, initialFixtureId }
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
