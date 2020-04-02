import { getFixtureInfo, getCosmosConfigAtPath } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture info', async () => {
  const rendererUrls = getFixtureInfo({ cosmosConfig });
  expect(rendererUrls).toEqual([
    {
      cleanPath: ['Counter', 'default'],
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D'
    },
    {
      cleanPath: ['Counter', 'small number'],
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D'
    },
    {
      cleanPath: ['Counter', 'large number'],
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D'
    },
    {
      cleanPath: ['Hello World'],
      filePath: expect.stringContaining('/example/__fixtures__/Hello World.ts'),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D'
    },
    {
      cleanPath: ['Props Playground'],
      filePath: expect.stringContaining(
        '/example/__fixtures__/Props Playground.tsx'
      ),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D'
    },
    {
      cleanPath: ['Values Playground'],
      filePath: expect.stringContaining(
        '/example/__fixtures__/Values Playground.tsx'
      ),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D'
    },
    {
      cleanPath: ['CounterButton'],
      filePath: expect.stringContaining(
        '/example/CounterButton/index.fixture.tsx'
      ),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D'
    },
    {
      cleanPath: ['NestedDecorators'],
      filePath: expect.stringContaining(
        '/example/NestedDecorators/index.fixture.tsx'
      ),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D'
    },
    {
      cleanPath: ['WelcomeMessage'],
      filePath: expect.stringContaining(
        '/example/WelcomeMessage/index.fixture.tsx'
      ),
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D'
    }
  ]);
});
