import { FixtureListItemUpdateResponse } from 'react-cosmos-core';
import { RendererCoreContext } from '../shared/index.js';

export function receiveFixtureListItemUpdateResponse(
  context: RendererCoreContext,
  { payload }: FixtureListItemUpdateResponse
) {
  const { rendererId, fixturePath, fixtureItem } = payload;
  const { primaryRendererId } = context.getState();

  // Discard updates from secondary renderers
  if (rendererId === primaryRendererId) {
    context.setState(prevState => ({
      ...prevState,
      fixtures: {
        ...prevState.fixtures,
        [fixturePath]: fixtureItem,
      },
    }));
  }
}
