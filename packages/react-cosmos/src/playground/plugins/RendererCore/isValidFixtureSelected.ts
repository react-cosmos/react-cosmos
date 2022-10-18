import { RendererCoreContext } from './shared';
import { getSelectedFixtureId } from './shared/router';

export function isValidFixtureSelected(context: RendererCoreContext) {
  const fixtureId = getSelectedFixtureId(context);
  if (fixtureId === null) {
    return false;
  }

  const { fixtures } = context.getState();
  if (!fixtures.hasOwnProperty(fixtureId.path)) {
    return false;
  }

  const fixtureItem = fixtures[fixtureId.path];
  return fixtureItem.type === 'multi'
    ? fixtureId.name !== undefined &&
        fixtureItem.fixtureNames.indexOf(fixtureId.name) !== -1
    : fixtureId.name === undefined;
}
