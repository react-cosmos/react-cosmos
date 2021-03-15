import { FixtureId } from 'react-cosmos-shared2/renderer';
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
    ? matchFixtureName(fixtureId, fixtureItem.fixtureNames)
    : fixtureId.name === null;
}

function matchFixtureName(fixtureId: FixtureId, fixtureNames: string[]) {
  return fixtureId.name !== null && fixtureNames.indexOf(fixtureId.name) !== -1;
}
