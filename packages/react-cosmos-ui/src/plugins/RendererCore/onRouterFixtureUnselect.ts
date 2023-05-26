import { RendererCoreContext } from './shared/index.js';
import { postUnselectFixtureRequest } from './shared/postRequest.js';

export function onRouterFixtureUnselect(context: RendererCoreContext) {
  context.setState(
    prevState => ({ ...prevState, fixtureState: {} }),
    () => {
      const { connectedRendererIds } = context.getState();
      connectedRendererIds.forEach(rendererId => {
        postUnselectFixtureRequest(context, rendererId);
      });
    }
  );
}
