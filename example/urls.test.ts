import { getFixtureUrls, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns playground URLs', async () => {
  const rendererUrls = await getFixtureUrls({ cosmosConfig });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
    ]
  `);
});

it('returns renderer URLs in full screen mode', async () => {
  const rendererUrls = await getFixtureUrls({ cosmosConfig, fullScreen: true });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
    ]
  `);
});
