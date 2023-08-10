import path from 'node:path';
import { create } from 'react-test-renderer';
import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { getFixtures } from './getFixtures.js';

const rootDir = path.join(__dirname, '../../../../examples/webpack');

it('renders fixture elements', async () => {
  const cosmosConfig = createCosmosConfig(rootDir, {
    ignore: ['**/*.mdx'],
  });

  const fixures = getFixtures(cosmosConfig, {
    rendererUrl: 'http://localhost:5000/renderer.html',
  });

  function testFixtureElement(relPath: string, name: string | null = null) {
    const match = fixures.find(
      f => f.relativeFilePath === relPath && f.name === name
    );
    expect(create(match!.getElement())).toMatchSnapshot();
  }

  testFixtureElement('src/CounterButton.fixture.tsx');
  testFixtureElement('src/Counter.fixture.tsx', 'large number');
  testFixtureElement('src/WelcomeMessage/WelcomeMessage.fixture.tsx');
});

it('returns fixture info', async () => {
  const cosmosConfig = createCosmosConfig(rootDir, {
    ignore: ['**/*.mdx'],
  });

  const fixtures = getFixtures(cosmosConfig, {
    rendererUrl: 'http://localhost:5000/renderer.html',
  });

  expect(fixtures).toEqual([
    {
      absoluteFilePath: path.join(
        rootDir,
        'src/__fixtures__/controls/Custom Panel.tsx'
      ),
      fileName: 'Custom Panel',
      getElement: expect.any(Function),
      name: null,
      parents: ['controls'],
      relativeFilePath: 'src/__fixtures__/controls/Custom Panel.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2Fcontrols%2FCustom+Panel.tsx%22%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2Fcontrols%2FCustom+Panel.tsx%22%7D',
      treePath: ['controls', 'Custom Panel'],
    },
    {
      absoluteFilePath: path.join(
        rootDir,
        'src/__fixtures__/controls/Props Panel.tsx'
      ),
      fileName: 'Props Panel',
      getElement: expect.any(Function),
      name: null,
      parents: ['controls'],
      relativeFilePath: 'src/__fixtures__/controls/Props Panel.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2Fcontrols%2FProps+Panel.tsx%22%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2Fcontrols%2FProps+Panel.tsx%22%7D',
      treePath: ['controls', 'Props Panel'],
    },
    {
      absoluteFilePath: path.join(rootDir, 'src/Counter.fixture.tsx'),
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'default',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      relativeFilePath: 'src/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22default%22%7D',
      treePath: ['Counter', 'default'],
    },
    {
      absoluteFilePath: path.join(rootDir, 'src/Counter.fixture.tsx'),
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'small number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small+number%22%7D',
      relativeFilePath: 'src/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22small+number%22%7D',
      treePath: ['Counter', 'small number'],
    },
    {
      absoluteFilePath: path.join(rootDir, 'src/Counter.fixture.tsx'),
      fileName: 'Counter',
      getElement: expect.any(Function),
      name: 'large number',
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large+number%22%7D',
      relativeFilePath: 'src/Counter.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FCounter.fixture.tsx%22%2C%22name%22%3A%22large+number%22%7D',
      treePath: ['Counter', 'large number'],
    },
    {
      absoluteFilePath: path.join(rootDir, 'src/CounterButton.fixture.tsx'),
      fileName: 'CounterButton',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FCounterButton.fixture.tsx%22%7D',
      relativeFilePath: 'src/CounterButton.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FCounterButton.fixture.tsx%22%7D',
      treePath: ['CounterButton'],
    },
    {
      absoluteFilePath: path.join(
        rootDir,
        'src/WelcomeMessage/WelcomeMessage.fixture.tsx'
      ),
      fileName: 'WelcomeMessage',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%7D',
      relativeFilePath: 'src/WelcomeMessage/WelcomeMessage.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FWelcomeMessage%2FWelcomeMessage.fixture.tsx%22%7D',
      treePath: ['WelcomeMessage'],
    },
  ]);
});
