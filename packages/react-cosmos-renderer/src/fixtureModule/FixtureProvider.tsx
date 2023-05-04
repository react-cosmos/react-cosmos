'use client';
import { isEqual } from 'lodash-es';
import React from 'react';
import {
  FixtureId,
  FixtureListItem,
  FixtureState,
  SetFixtureState,
} from 'react-cosmos-core';
import { FixtureContext } from '../fixture/FixtureContext.js';
import { RendererContext } from '../rendererConnect/RendererContext.js';

type Props = {
  children: React.ReactNode;
  fixtureId: FixtureId;
  initialFixtureState?: FixtureState;
  fixtureItem: FixtureListItem;
};

type State = {
  fixtureState: FixtureState;
  syncedFixtureState: FixtureState;
};

export function FixtureProvider(props: Props) {
  const [state, setState] = React.useState<State>({
    fixtureState: props.initialFixtureState || {},
    syncedFixtureState: {},
  });

  const { rendererId, rendererConnect } = React.useContext(RendererContext);

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

  React.useEffect(
    () =>
      rendererConnect.onMessage(msg => {
        if (
          // WIP: Checking for selectFixture is only needed when using
          // ServerFixtureLoader. When a server-side remote renderer mounts
          // its client components, it will receive a setFixture message to
          // syncronize
          (msg.type === 'selectFixture' || msg.type === 'setFixtureState') &&
          msg.payload.rendererId === rendererId
        ) {
          const { fixtureId, fixtureState } = msg.payload;
          setState(prevState =>
            // Ensure fixture state applies to currently selected fixture
            isEqual(fixtureId, props.fixtureId)
              ? { ...prevState, fixtureState, syncedFixtureState: fixtureState }
              : prevState
          );
        }
      }),
    [props.fixtureId, rendererConnect, rendererId]
  );

  const setFixtureState = React.useCallback<SetFixtureState>(
    stateUpdate => {
      setState(prevState => ({
        ...prevState,
        fixtureState: stateUpdate(prevState.fixtureState),
      }));
    },
    [setState]
  );

  const contextValue = React.useMemo(
    () => ({ fixtureState: state.fixtureState, setFixtureState }),
    [setFixtureState, state.fixtureState]
  );

  return (
    <FixtureContext.Provider value={contextValue}>
      {props.children}
    </FixtureContext.Provider>
  );
}
