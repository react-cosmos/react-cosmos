import { getCosmosConfigAtPath, getFixtures2 } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('../cosmos.config'));

it('returns fixture info', async () => {
  const fixtures = getFixtures2(cosmosConfig);
  expect(fixtures).toEqual([
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'default',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      relativeFilePath: 'components/Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      treePath: ['Counter', 'default'],
    },
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'small number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      relativeFilePath: 'components/Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      treePath: ['Counter', 'small number'],
    },
    {
      absoluteFilePath: `${__dirname}/Counter/index.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'large number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      relativeFilePath: 'components/Counter/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FCounter%2Findex.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      treePath: ['Counter', 'large number'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Controls playground.tsx`,
      fileName: 'Controls playground',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'components/__fixtures__/Controls playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Controls playground'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Hello World.ts`,
      fileName: 'Hello World',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'components/__fixtures__/Hello World.ts',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      treePath: ['Hello World'],
    },
    {
      absoluteFilePath: `${__dirname}/__fixtures__/Props playground.tsx`,
      fileName: 'Props playground',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'components/__fixtures__/Props playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Props playground'],
    },
    {
      absoluteFilePath: `${__dirname}/CounterButton/index.fixture.tsx`,
      fileName: 'CounterButton',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FCounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'components/CounterButton/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FCounterButton%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['CounterButton'],
    },
    {
      absoluteFilePath: `${__dirname}/NestedDecorators/index.fixture.tsx`,
      fileName: 'NestedDecorators',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FNestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'components/NestedDecorators/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FNestedDecorators%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['NestedDecorators'],
    },
    {
      absoluteFilePath: `${__dirname}/WelcomeMessage/index.fixture.tsx`,
      fileName: 'WelcomeMessage',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22components%2FWelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'components/WelcomeMessage/index.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22components%2FWelcomeMessage%2Findex.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['WelcomeMessage'],
    },
  ]);
});
