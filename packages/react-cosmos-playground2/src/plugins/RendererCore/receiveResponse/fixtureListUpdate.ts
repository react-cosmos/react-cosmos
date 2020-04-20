import { FixtureListUpdateResponse } from 'react-cosmos-shared2/renderer';
import { RendererCoreContext } from '../shared';

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
