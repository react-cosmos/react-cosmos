// TODO: Maybe move to rendererConnect folder
'use client';
import React from 'react';
import { FixtureId, FixtureList } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  fixtures: FixtureList;
  initialFixtureId?: FixtureId | null;
};
export function RendererSync({
  children,
  fixtures,
  initialFixtureId = null,
}: Props) {
  const { rendererId, rendererConnect, reloadRenderer } =
    React.useContext(RendererContext);

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
            // Read searchParams from rendererConnect
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
        } else if (
          msg.type === 'reloadRenderer' &&
          msg.payload.rendererId === rendererId
        ) {
          reloadRenderer();
        }
      }),
    [fixtures, reloadRenderer, rendererConnect, rendererId]
  );

  return <>{children}</>;
}
