// Import mocks first
import '../testHelpers/mockEsmRequire.js';
import '../testHelpers/mockEsmResolve.js';
import { mockCosmosConfig, mockFile } from '../testHelpers/mockFs.js';
import { mockCliArgs } from '../testHelpers/mockYargs.js';

import path from 'node:path';
import { create } from 'react-test-renderer';
import { mockCosmosPlugins } from '../testHelpers/mockCosmosPlugins.js';
import { getFixtures } from './getFixtures.js';

const rootDir = path.join(__dirname, '../../../../examples/webpack');

const testCosmosPlugin = {
  name: 'Test Cosmos plugin',
  rootDir: path.join(__dirname, 'mock-cosmos-plugin'),
  server: path.join(__dirname, 'mock-cosmos-plugin/server.js'),
};
mockCosmosPlugins([testCosmosPlugin]);

const testServerPlugin = {
  name: 'testServerPlugin',

  config: jest.fn(async ({ cosmosConfig }) => {
    return {
      ...cosmosConfig,
      rendererUrl: 'http://localhost:5000/renderer.html',
    };
  }),
};

beforeEach(() => {
  mockCliArgs({});
  mockCosmosConfig('cosmos.config.json', { rootDir });
  mockFile(testCosmosPlugin.server, { default: testServerPlugin });
});

it('renders fixture elements', async () => {
  const fixures = await getFixtures();

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
  const fixtures = await getFixtures();
  expect(fixtures).toEqual([
    {
      absoluteFilePath: path.join(rootDir, 'src/__fixtures__/Controls.tsx'),
      fileName: 'Controls',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'src/__fixtures__/Controls.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls.tsx%22%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FControls.tsx%22%7D',
      treePath: ['Controls'],
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
      absoluteFilePath: path.join(rootDir, 'src/__fixtures__/HelloWorld.ts'),
      fileName: 'HelloWorld',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHelloWorld.ts%22%7D',
      relativeFilePath: 'src/__fixtures__/HelloWorld.ts',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FHelloWorld.ts%22%7D',
      treePath: ['HelloWorld'],
    },
    {
      absoluteFilePath: path.join(
        rootDir,
        'src/NestedDecorators/NestedDecorators.fixture.tsx'
      ),
      fileName: 'NestedDecorators',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%7D',
      relativeFilePath: 'src/NestedDecorators/NestedDecorators.fixture.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2FNestedDecorators%2FNestedDecorators.fixture.tsx%22%7D',
      treePath: ['NestedDecorators'],
    },
    {
      absoluteFilePath: path.join(rootDir, 'src/__fixtures__/Props.tsx'),
      fileName: 'Props',
      getElement: expect.any(Function),
      name: null,
      parents: [],
      relativeFilePath: 'src/__fixtures__/Props.tsx',
      rendererUrl:
        'http://localhost:5000/renderer.html?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps.tsx%22%7D',
      playgroundUrl:
        'http://localhost:5000/?fixtureId=%7B%22path%22%3A%22src%2F__fixtures__%2FProps.tsx%22%7D',
      treePath: ['Props'],
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
