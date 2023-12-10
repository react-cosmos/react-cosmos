import { FixtureState } from 'react-cosmos-core';
import { RendererCoreContext } from './index.js';

export function createInitialFixtureState(context: RendererCoreContext) {
  const { initialFixtureStateUpdaters } = context.getState();
  return initialFixtureStateUpdaters.reduce(
    (acc: FixtureState, updater) => updater(acc),
    {}
  );
}
