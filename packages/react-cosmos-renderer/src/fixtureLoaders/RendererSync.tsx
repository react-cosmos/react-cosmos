'use client';
import React from 'react';
import { FixtureList } from 'react-cosmos-core';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  fixtures: FixtureList;
};
export function RendererSync({ children, fixtures }: Props) {
  const {
    params: { fixtureId: selectedFixtureId },
    rendererId,
    rendererConnect,
    reloadRenderer,
    lazyItems,
  } = React.useContext(RendererContext);

  const readyRef = React.useRef(false);
  React.useEffect(() => {
    if (!readyRef.current) {
      rendererConnect.postMessage({
        type: 'rendererReady',
        payload: {
          rendererId,
          selectedFixtureId,
        },
      });
      readyRef.current = true;
    }
  }, [rendererConnect, rendererId, selectedFixtureId]);

  React.useEffect(() => {
    rendererConnect.postMessage({
      type: 'fixtureListUpdate',
      payload: {
        rendererId,
        fixtures: { ...fixtures, ...lazyItems },
      },
    });
  }, [fixtures, lazyItems, rendererConnect, rendererId]);

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (msg.type === 'pingRenderers') {
          rendererConnect.postMessage({
            type: 'rendererReady',
            payload: {
              rendererId,
              selectedFixtureId,
            },
          });
          rendererConnect.postMessage({
            type: 'fixtureListUpdate',
            payload: {
              rendererId,
              fixtures,
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
