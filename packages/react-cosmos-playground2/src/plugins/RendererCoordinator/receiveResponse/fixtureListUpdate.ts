import { FixtureListUpdateResponse } from 'react-cosmos-shared2/renderer';
import { RendererCoordinatorContext } from '../shared';

export function receiveFixtureListUpdateResponse(
  context: RendererCoordinatorContext,
  { payload }: FixtureListUpdateResponse
) {
  const { rendererId, fixtures } = payload;
  const { primaryRendererId } = context.getState();

  // Discard updates from secondary renderers
  if (rendererId === primaryRendererId) {
    context.setState(prevState => ({
      ...prevState,
      fixtures
    }));
  }
}
