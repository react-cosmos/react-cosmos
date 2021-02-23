import { getCosmosConfigAtPath, getFixtures2 } from 'react-cosmos';

const cosmosConfig = getCosmosConfigAtPath(require.resolve('../cosmos.config'));
const { rootDir } = cosmosConfig;

it('returns fixture info', async () => {
  const fixtures = getFixtures2(cosmosConfig);
  expect(fixtures).toEqual([
    {
      absoluteFilePath: `${rootDir}/src/__fixtures__/Controls playground.tsx`,
      fileName: 'Controls playground',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'src/__fixtures__/Controls playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls%20playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Controls playground'],
    },
    {
      absoluteFilePath: `${rootDir}/src/Counter/Counter.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'default',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      relativeFilePath: 'src/Counter/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      treePath: ['Counter', 'default'],
    },
    {
      absoluteFilePath: `${rootDir}/src/Counter/Counter.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'small number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      relativeFilePath: 'src/Counter/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small%20number%22%7D',
      treePath: ['Counter', 'small number'],
    },
    {
      absoluteFilePath: `${rootDir}/src/Counter/Counter.fixture.tsx`,
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'large number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      relativeFilePath: 'src/Counter/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounter%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large%20number%22%7D',
      treePath: ['Counter', 'large number'],
    },
    {
      absoluteFilePath: `${rootDir}/src/CounterButton/CounterButton.fixture.tsx`,
      fileName: 'CounterButton',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounterButton%2FCounterButton.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'src/CounterButton/CounterButton.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FCounterButton%2FCounterButton.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['CounterButton'],
    },
    {
      absoluteFilePath: `${rootDir}/src/__fixtures__/Hello World.ts`,
      fileName: 'Hello World',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'src/__fixtures__/Hello World.ts',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHello%20World.ts%22%2C%22name%22%3Anull%7D',
      treePath: ['Hello World'],
    },
    {
      absoluteFilePath: `${rootDir}/src/NestedDecorators/NestedDecorators.fixture.tsx`,
      fileName: 'NestedDecorators',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'src/NestedDecorators/NestedDecorators.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['NestedDecorators'],
    },
    {
      absoluteFilePath: `${rootDir}/src/__fixtures__/Props playground.tsx`,
      fileName: 'Props playground',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'src/__fixtures__/Props playground.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps%20playground.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['Props playground'],
    },
    {
      absoluteFilePath: `${rootDir}/src/WelcomeMessage/WelcomeMessage.fixture.tsx`,
      fileName: 'WelcomeMessage',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%2C%22name%22%3Anull%7D',
      relativeFilePath: 'src/WelcomeMessage/WelcomeMessage.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/_renderer.html?_fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%2C%22name%22%3Anull%7D',
      treePath: ['WelcomeMessage'],
    },
  ]);
});
