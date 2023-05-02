'use client';
import React from 'react';
import { FixtureListItem } from 'react-cosmos-core';
import { RendererConnectContext } from '../rendererConnect/RendererConnectContext.js';
import { useRendererMessage } from '../rendererConnect/useRendererMessage.js';
import { SelectedFixtureContext } from './SelectedFixtureContext.js';

type Props = {
  children: React.ReactNode;
  fixturePath: string;
  fixtureItem: FixtureListItem;
};
export function SelectedFixtureConnect({
  children,
  fixturePath,
  fixtureItem,
}: Props) {
  useFixtureListItemUpdate(fixturePath, fixtureItem);
  useReceiveFixtureState();

  return <>{children}</>;
}

function useFixtureListItemUpdate(
  fixturePath: string,
  fixtureItem: FixtureListItem
) {
  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );
  React.useEffect(() => {
    rendererConnect.postMessage({
      type: 'fixtureListItemUpdate',
      payload: {
        rendererId,
        fixturePath,
        fixtureItem,
      },
    });
  }, [fixtureItem, fixturePath, rendererConnect, rendererId]);
}

function useReceiveFixtureState() {
  const { receiveFixtureState } = React.useContext(SelectedFixtureContext);
  useRendererMessage(
    React.useCallback(
      msg => {
        if (msg.type === 'setFixtureState') {
          const { fixtureId, fixtureState } = msg.payload;
          receiveFixtureState(fixtureId, fixtureState);
        }
      },
      [receiveFixtureState]
    )
  );
}
