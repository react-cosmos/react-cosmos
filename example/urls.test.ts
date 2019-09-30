import { getFixtureUrls, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture URLs', async () => {
  const fixtureUrls = await getFixtureUrls({ cosmosConfig, fullScreen: true });
  expect(fixtureUrls).toMatchInlineSnapshot(`
    Array [
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
    ]
  `);
});
