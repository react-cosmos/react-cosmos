import { FixtureState, StateUpdater } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';

export function extendInitialFixtureState(
  context: RendererCoreContext,
  stateUpdater: StateUpdater<FixtureState>
) {
  context.setState(prevState => ({
    ...prevState,
    initFixtureStateUpdaters: [
      ...prevState.initialFixtureStateUpdaters,
      stateUpdater,
    ],
  }));
  return () =>
    context.setState(prevState => ({
      ...prevState,
      initFixtureStateUpdaters: prevState.initialFixtureStateUpdaters.filter(
        updater => updater !== stateUpdater
      ),
    }));
}
