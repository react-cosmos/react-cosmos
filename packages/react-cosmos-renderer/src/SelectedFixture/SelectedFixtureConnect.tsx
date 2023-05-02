'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureListItem } from 'react-cosmos-core';
import { RendererConnectContext } from '../rendererConnect2/RendererConnectContext.js';
import { useRendererMessage } from '../rendererConnect2/useRendererMessage.js';
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
  useFixtureStateChangeResponse();
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

function useFixtureStateChangeResponse() {
  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );
  const { fixtureId, fixtureState, syncedFixtureState, syncFixtureState } =
    React.useContext(SelectedFixtureContext);

  React.useEffect(() => {
    if (!isEqual(fixtureState, syncedFixtureState)) {
      rendererConnect.postMessage({
        type: 'fixtureStateChange',
        payload: {
          rendererId,
          fixtureId,
          fixtureState,
        },
      });
      syncFixtureState(fixtureState);
    }
  }, [
    fixtureId,
    fixtureState,
    rendererConnect,
    rendererId,
    syncFixtureState,
    syncedFixtureState,
  ]);
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
