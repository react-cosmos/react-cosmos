import { FixtureListUpdateResponse } from 'react-cosmos-core';
import { RendererCoreContext } from '../shared/index.js';

export function receiveFixtureListUpdateResponse(
  context: RendererCoreContext,
  { payload }: FixtureListUpdateResponse
) {
  const { rendererId, fixtures } = payload;
  const { primaryRendererId } = context.getState();

  // Discard updates from secondary renderers
  if (rendererId === primaryRendererId) {
    context.setState(prevState => ({
      ...prevState,
      fixtures,
    }));
  }
}
