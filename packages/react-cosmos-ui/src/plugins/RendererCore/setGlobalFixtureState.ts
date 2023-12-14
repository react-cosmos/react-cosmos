import { setFixtureState } from './setFixtureState.js';
import { RendererCoreContext } from './shared/index.js';
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
    setFixtureState(context, prevFixtureState => ({
      ...prevFixtureState,
      [name]: state,
    }));
  }
}
