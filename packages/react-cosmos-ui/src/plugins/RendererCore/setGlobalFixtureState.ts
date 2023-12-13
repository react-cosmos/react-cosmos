import { FixtureState } from 'react-cosmos-core';
import { setFixtureState } from './setFixtureState.js';
import { RendererCoreContext } from './shared/index.js';
import { getSelectedFixtureId } from './shared/router.js';

export function setGlobalFixtureState(
  context: RendererCoreContext,
  newState: FixtureState
) {
  context.setState(prevState => ({
    ...prevState,
    globalFixtureState: {
      ...prevState.globalFixtureState,
      ...newState,
    },
  }));

  const fixtureId = getSelectedFixtureId(context);
  if (fixtureId) {
    setFixtureState(context, prevFixtureState => ({
      ...prevFixtureState,
      ...newState,
    }));
  }
}
