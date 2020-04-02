import { getFixtureInfo, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture info', async () => {
  const rendererUrls = getFixtureInfo({ cosmosConfig });
  expect(rendererUrls).toMatchInlineSnapshot(`
    Array [
      Object {
        "cleanPath": Array [
          "Counter",
          "default",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/Counter/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D",
      },
      Object {
        "cleanPath": Array [
          "Counter",
          "small number",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/Counter/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D",
      },
      Object {
        "cleanPath": Array [
          "Counter",
          "large number",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/Counter/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D",
      },
      Object {
        "cleanPath": Array [
          "Hello World",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/__fixtures__/Hello World.ts",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "cleanPath": Array [
          "Props Playground",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/__fixtures__/Props Playground.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "cleanPath": Array [
          "Values Playground",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/__fixtures__/Values Playground.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "cleanPath": Array [
          "CounterButton",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/CounterButton/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "cleanPath": Array [
          "NestedDecorators",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/NestedDecorators/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
      Object {
        "cleanPath": Array [
          "WelcomeMessage",
        ],
        "filePath": "/Users/ovidiu/Work/@react-cosmos/react-cosmos/example/WelcomeMessage/index.fixture.tsx",
        "playgroundUrl": "http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
        "rendererUrl": "http://localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D",
      },
    ]
  `);
});
