import { setFixtureState } from './setFixtureState.js';
import type { RendererCoreContext } from './shared/index.js';
import { getSelectedFixtureId } from './shared/router.js';

export function setGlobalFixtureState(
  context: RendererCoreContext,
  name: string,
  state: unknown
) {
  context.setState(prevState => ({
    ...prevState,
    globalFixtureState: {
      ...prevState.globalFixtureState,
      [name]: state,
    },
  }));

  const fixtureId = getSelectedFixtureId(context);
  if (fixtureId) {
    setFixtureState(context, name, state);
  }
}
