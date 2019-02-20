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
  if (fixtureId.name !== null) {
    throw new Error(`Named fixture ID doesn't match unnamed fixtures at path`);
  }

  return true;
}

function doesFixtureIdMatchNamedFixtures(
  fixtureId: FixtureId,
  fixtureNames: string[]
) {
  if (fixtureId.name === null) {
    throw new Error(`Unnamed fixtureId doesn't match named fixtures at path`);
  }

  return fixtureNames.indexOf(fixtureId.name) !== -1;
}
