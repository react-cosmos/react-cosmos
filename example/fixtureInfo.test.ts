import { getFixtureInfo, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture info', async () => {
  const rendererUrls = getFixtureInfo({ cosmosConfig });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "__fixtures__/Hello World.ts",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "__fixtures__/Props Playground.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "__fixtures__/Values Playground.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "fixtureId": Object {
          "name": "default",
          "path": "Counter/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      },
      Object {
        "fixtureId": Object {
          "name": "small number",
          "path": "Counter/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      },
      Object {
        "fixtureId": Object {
          "name": "large number",
          "path": "Counter/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      },
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "CounterButton/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "NestedDecorators/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "fixtureId": Object {
          "name": null,
          "path": "WelcomeMessage/index.fixture.tsx",
        },
        "playgroundUrl": "localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
    ]
  `);
});
