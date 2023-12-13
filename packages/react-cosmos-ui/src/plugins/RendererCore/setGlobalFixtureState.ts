import { FixtureState } from 'react-cosmos-core';
import { RendererCoreContext } from './shared/index.js';

export function setGlobalFixtureState(
  context: RendererCoreContext,
  fixtureState: FixtureState
) {
  context.setState(prevState => ({
    ...prevState,
    globalFixtureState: {
      ...prevState.globalFixtureState,
      ...fixtureState,
    },
  }));
}
