import { getCosmosConfigAtPath, getFixtureInfo } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture info', async () => {
  const rendererUrls = getFixtureInfo({ cosmosConfig });
  expect(rendererUrls).toEqual([
    {
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      fileName: 'index',
      name: 'default',
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      treePath: ['Counter', 'default']
    },
    {
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      fileName: 'index',
      name: 'small number',
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      treePath: ['Counter', 'small number']
    },
    {
      filePath: expect.stringContaining('/example/Counter/index.fixture.tsx'),
      fileName: 'index',
      name: 'large number',
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      treePath: ['Counter', 'large number']
    },
    {
      filePath: expect.stringContaining('/example/__fixtures__/Hello World.ts'),
      fileName: 'Hello World',
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      treePath: ['Hello World']
    },
    {
      filePath: expect.stringContaining(
        '/example/__fixtures__/Props Playground.tsx'
      ),
      fileName: 'Props Playground',
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Props Playground']
    },
    {
      filePath: expect.stringContaining(
        '/example/__fixtures__/Values Playground.tsx'
      ),
      fileName: 'Values Playground',
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Values Playground']
    },
    {
      fileName: 'index',
      filePath: expect.stringContaining(
        '/example/CounterButton/index.fixture.tsx'
      ),
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['CounterButton']
    },
    {
      fileName: 'index',
      filePath: expect.stringContaining(
        '/example/NestedDecorators/index.fixture.tsx'
      ),
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['NestedDecorators']
    },
    {
      fileName: 'index',
      filePath: expect.stringContaining(
        '/example/WelcomeMessage/index.fixture.tsx'
      ),
      name: null,
      playgroundUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      rendererUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['WelcomeMessage']
    }
  ]);
});
