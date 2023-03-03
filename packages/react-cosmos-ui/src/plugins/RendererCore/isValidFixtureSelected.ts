import { FixtureId } from 'react-cosmos-core';
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
  return fixtureItem.type === 'multi'
    ? matchFixtureName(fixtureId, fixtureItem.fixtureNames)
    : fixtureId.name === undefined;
}

function matchFixtureName(fixtureId: FixtureId, fixtureNames: string[]) {
  return (
    // TODO: Test when fixtureId.name === undefined
    fixtureId.name === undefined || fixtureNames.indexOf(fixtureId.name) !== -1
  );
}
