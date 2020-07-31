import { FixtureId } from 'react-cosmos-shared2/renderer';
import { getCosmosConfigAtPath, getFixtures } from 'react-cosmos';
import { create } from 'react-test-renderer';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('../cosmos.config'));

it('returns fixture elements', async () => {
  expect.hasAssertions();
  const fixtures = await getFixtures({ cosmosConfig });
  fixtures.forEach(({ fixtureId, getElement }) => {
    const renderer = create(getElement());
    expect(renderer.toJSON()).toMatchSnapshot(stringifyFixtureId(fixtureId));
  });
});

function stringifyFixtureId({ path, name }: FixtureId) {
  return name ? `${path} ${name}` : path;
}
