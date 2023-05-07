'use client';
import React from 'react';
import { FixtureList } from 'react-cosmos-core';
import { RendererContext } from './RendererContext.js';

type Props = {
  children: React.ReactNode;
  fixtures: FixtureList;
};
export function RendererSync({ children, fixtures }: Props) {
  const { searchParams, rendererId, rendererConnect, reloadRenderer } =
    React.useContext(RendererContext);

  const { fixtureId: selectedFixtureId } = searchParams;

  const readyRef = React.useRef(false);
  React.useEffect(() => {
    if (readyRef.current) {
      rendererConnect.postMessage({
        type: 'fixtureListUpdate',
        payload: {
          rendererId,
          fixtures,
        },
      });
    } else {
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: {
          rendererId,
          fixtures,
          selectedFixtureId,
        },
      });
      readyRef.current = true;
    }
  }, [fixtures, rendererConnect, rendererId, selectedFixtureId]);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (msg.type === 'pingRenderers') {
          rendererConnect.postMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              fixtures,
              selectedFixtureId,
            },
          });
        } else if (
          msg.type === 'reloadRenderer' &&
          msg.payload.rendererId === rendererId
        ) {
          reloadRenderer();
        }
      }),
    [fixtures, reloadRenderer, rendererConnect, rendererId, selectedFixtureId]
  );

  return <>{children}</>;
}
