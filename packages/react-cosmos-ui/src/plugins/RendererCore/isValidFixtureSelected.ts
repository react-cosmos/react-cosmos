import { RendererCoreContext } from './shared/index.js';
import { getSelectedFixtureId } from './shared/router.js';

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
  return (
    (fixtureItem.type === 'single' && fixtureId.name === undefined) ||
    // Allow selecting multi fixtures by path only
    (fixtureItem.type === 'multi' &&
      (fixtureId.name === undefined ||
        fixtureItem.fixtureNames.indexOf(fixtureId.name) !== -1))
  );
}
