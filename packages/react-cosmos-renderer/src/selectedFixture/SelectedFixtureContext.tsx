'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId, FixtureState, SetFixtureState } from 'react-cosmos-core';
import { FixtureContextProvider } from '../fixture/FixtureContext.js';
import { RendererConnectContext } from '../rendererConnect/RendererConnectContext.js';

type SelectedFixtureContextValue = {
  fixtureId: FixtureId;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  receiveFixtureState: (
    fixtureId: FixtureId,
    fixtureState: FixtureState
  ) => void;
};

export const SelectedFixtureContext =
  React.createContext<SelectedFixtureContextValue>({
    fixtureId: { path: '' },
    fixtureState: {},
    setFixtureState: () => {},
    receiveFixtureState: () => {},
  });

type ProviderProps = {
  children: React.ReactNode;
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
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

  const receiveFixtureState = React.useCallback(
    (fixtureId: FixtureId, fixtureState: FixtureState) => {
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
    },
    [props.fixtureId]
  );

  const { rendererId, rendererConnect } = React.useContext(
    RendererConnectContext
  );
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

  const value = React.useMemo<SelectedFixtureContextValue>(
    () => ({
      fixtureId: props.fixtureId,
      fixtureState: state.fixtureState,
      setFixtureState,
      receiveFixtureState,
    }),
    [props.fixtureId, receiveFixtureState, setFixtureState, state.fixtureState]
  );

  return (
    <SelectedFixtureContext.Provider value={value}>
      <FixtureContextProvider
        fixtureId={props.fixtureId}
        fixtureState={state.fixtureState}
        setFixtureState={setFixtureState}
      >
        {props.children}
      </FixtureContextProvider>
    </SelectedFixtureContext.Provider>
  );
}
