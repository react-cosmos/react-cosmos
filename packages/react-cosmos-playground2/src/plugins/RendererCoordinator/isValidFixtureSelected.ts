import { getUrlParams } from './shared/router';
import { RendererCoordinatorContext } from './shared';

export function isValidFixtureSelected(context: RendererCoordinatorContext) {
  const { fixturePath } = getUrlParams(context);

  return (
    fixturePath !== undefined &&
    context.getState().fixtures.indexOf(fixturePath) !== -1
  );
}
