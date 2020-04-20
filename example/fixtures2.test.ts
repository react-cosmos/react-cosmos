import { getCosmosConfigAtPath, getFixtures2 } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('./cosmos.config'));

it('returns fixture info', async () => {
  const fixtures = getFixtures2({ cosmosConfig });
  expect(fixtures).toEqual([
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: 'default',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      relativeFilePath: 'Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      treePath: ['Counter', 'default'],
    },
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: 'small number',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      relativeFilePath: 'Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      treePath: ['Counter', 'small number'],
    },
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: 'large number',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      relativeFilePath: 'Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22Counter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      treePath: ['Counter', 'large number'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Hello World.ts`,
      fileName: 'Hello World',
      getElement: expect.any(Function),
      name: null,
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      relativeFilePath: '__fixtures__/Hello World.ts',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      treePath: ['Hello World'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Props Playground.tsx`,
      fileName: 'Props Playground',
      getElement: expect.any(Function),
      name: null,
      relativeFilePath: '__fixtures__/Props Playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FProps%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Props Playground'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Values Playground.tsx`,
      fileName: 'Values Playground',
      getElement: expect.any(Function),
      name: null,
      relativeFilePath: '__fixtures__/Values Playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22__fixtures__%2FValues%20Playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Values Playground'],
    },
    {
      absoluteFilePath: `${__dirname}/CounterButton/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: null,
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'CounterButton/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22CounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['CounterButton'],
    },
    {
      absoluteFilePath: `${__dirname}/NestedDecorators/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: null,
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'NestedDecorators/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22NestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['NestedDecorators'],
    },
    {
      absoluteFilePath: `${__dirname}/WelcomeMessage/index.fixture.tsx`,
      fileName: 'index',
      getElement: expect.any(Function),
      name: null,
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'WelcomeMessage/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22WelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['WelcomeMessage'],
    },
  ]);
});
