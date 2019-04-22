import { FixtureId } from 'react-cosmos-shared2/renderer';
import { Context } from './shared';
import { getSelectedFixtureId } from './shared/router';

export function isValidFixtureSelected(context: Context) {
  const fixtureId = getSelectedFixtureId(context);
  if (fixtureId === null) {
    return false;
  }

  const { fixtures } = context.getState();
  if (!fixtures.hasOwnProperty(fixtureId.path)) {
    return false;
  }

  const fixtureNames = fixtures[fixtureId.path];
  return fixtureNames === null
    ? doesFixtureIdMatchUnnamedFixture(fixtureId)
    : doesFixtureIdMatchNamedFixtures(fixtureId, fixtureNames);
}

function doesFixtureIdMatchUnnamedFixture(fixtureId: FixtureId) {
  return fixtureId.name === null;
}

function doesFixtureIdMatchNamedFixtures(
  fixtureId: FixtureId,
  fixtureNames: string[]
) {
  return fixtureId.name !== null && fixtureNames.indexOf(fixtureId.name) !== -1;
}
