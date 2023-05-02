'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import {
  FixtureId,
  FixtureListItem,
  FixtureState,
  SetFixtureState,
} from 'react-cosmos-core';
import { FixtureContextProvider } from '../fixture/FixtureContext.js';
import { RendererConnectContext } from '../rendererConnect/RendererConnectContext.js';
import { useRendererMessage } from '../rendererConnect/useRendererMessage.js';

type ProviderProps = {
  children: React.ReactNode;
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
  fixtureItem: FixtureListItem;
};

type ProviderState = {
  fixtureState: FixtureState;
  syncedFixtureState: FixtureState;
};

export function SelectedFixtureProvider(props: ProviderProps) {
  const [state, setState] = React.useState<ProviderState>({
    fixtureState: props.initialFixtureState || {},
    syncedFixtureState: {},
  });

  const setFixtureState = React.useCallback<SetFixtureState>(
    stateUpdate => {
      setState(prevState => ({
        ...prevState,
        fixtureState: stateUpdate(prevState.fixtureState),
      }));
    },
    [setState]
  );

  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );

  React.useEffect(() => {
    rendererConnect.postMessage({
      type: 'fixtureListItemUpdate',
      payload: {
        rendererId,
        fixturePath: props.fixtureId.path,
        fixtureItem: props.fixtureItem,
      },
    });
  }, [props.fixtureId.path, props.fixtureItem, rendererConnect, rendererId]);

  React.useEffect(() => {
    if (!isEqual(state.fixtureState, state.syncedFixtureState)) {
      rendererConnect.postMessage({
        type: 'fixtureStateChange',
        payload: {
          rendererId,
          fixtureId: props.fixtureId,
          fixtureState: state.fixtureState,
        },
      });
      setState(prevState => ({
        ...prevState,
        syncedFixtureState: state.fixtureState,
      }));
    }
  }, [
    props.fixtureId,
    rendererConnect,
    rendererId,
    state.fixtureState,
    state.syncedFixtureState,
  ]);

  useRendererMessage(
    React.useCallback(
      msg => {
        if (msg.type === 'setFixtureState') {
          const { fixtureId, fixtureState } = msg.payload;
          setState(prevState => {
            // Ensure fixture state applies to currently selected fixture
            if (prevState && isEqual(fixtureId, props.fixtureId)) {
              return {
                ...prevState,
                fixtureState,
                syncedFixtureState: fixtureState,
              };
            } else {
              return prevState;
            }
          });
        }
      },
      [props.fixtureId]
    )
  );

  return (
    <FixtureContextProvider
      fixtureId={props.fixtureId}
      fixtureState={state.fixtureState}
      setFixtureState={setFixtureState}
    >
      {props.children}
    </FixtureContextProvider>
  );
}
