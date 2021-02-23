import { getFixtureUrls, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('../cosmos.config'));

it('returns playground URLs', async () => {
  const rendererUrls = await getFixtureUrls({ cosmosConfig });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounterButton%2FCounterButton.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%2C%22name%22%3Anull%7D",
    ]
  `);
});

it('returns renderer URLs in full screen mode', async () => {
  const rendererUrls = await getFixtureUrls({ cosmosConfig, fullScreen: true });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounterButton%2FCounterButton.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%2C%22name%22%3Anull%7D",
      "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%2C%22name%22%3Anull%7D",
    ]
  `);
});
