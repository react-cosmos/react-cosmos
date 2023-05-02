'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId, FixtureState, SetFixtureState } from 'react-cosmos-core';
import { FixtureContextProvider } from '../fixture/FixtureContext.js';

type SelectedFixtureState = {
  fixtureState: FixtureState;
  syncedFixtureState: FixtureState;
  renderKey: number;
};

type SelectedFixtureContextValue = SelectedFixtureState & {
  fixtureId: FixtureId;
  setFixtureState: SetFixtureState;
  syncFixtureState: (fixtureState: FixtureState) => void;
  receiveFixtureState: (
    fixtureId: FixtureId,
    fixtureState: FixtureState
  ) => void;
};

export const SelectedFixtureContext =
  React.createContext<SelectedFixtureContextValue>({
    fixtureId: { path: '' },
    fixtureState: {},
    syncedFixtureState: {},
    renderKey: 0,
    setFixtureState: () => {},
    syncFixtureState: () => {},
    receiveFixtureState: () => {},
  });

type ProviderProps = {
  children: React.ReactNode;
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
};
export function SelectedFixtureProvider(props: ProviderProps) {
  const [state, setState] = React.useState<SelectedFixtureState>({
    fixtureState: props.initialFixtureState || {},
    syncedFixtureState: {},
    renderKey: 0,
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

  const syncFixtureState = React.useCallback((fixtureState: FixtureState) => {
    setState(prevState => ({
      ...prevState,
      syncedFixtureState: fixtureState,
    }));
  }, []);

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

  const value = React.useMemo<SelectedFixtureContextValue>(
    () => ({
      fixtureId: props.fixtureId,
      fixtureState: state.fixtureState,
      syncedFixtureState: state.syncedFixtureState,
      renderKey: state.renderKey,
      setFixtureState,
      syncFixtureState,
      receiveFixtureState,
    }),
    [
      props.fixtureId,
      receiveFixtureState,
      setFixtureState,
      state.fixtureState,
      state.renderKey,
      state.syncedFixtureState,
      syncFixtureState,
    ]
  );

  return (
    <SelectedFixtureContext.Provider value={value}>
      <FixtureContextProvider
        // renderKey controls whether to reuse previous instances (and
        // transition props) or rebuild render tree from scratch
        key={state.renderKey}
        fixtureId={props.fixtureId}
        fixtureState={state.fixtureState}
        setFixtureState={setFixtureState}
      >
        {props.children}
      </FixtureContextProvider>
    </SelectedFixtureContext.Provider>
  );
}
