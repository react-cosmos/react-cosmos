import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { flattenFixtureTree } from './flattenFixtureTree';

const fixtures = {
  'src/__fixtures__/fixture1.ts': null,
  'src/__fixtures__/fixture2.ts': null,
  'src/foobar/index.fixture.ts': ['fixture3a', 'fixture3b'],
};

const fixtureTree = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});

it('flattens fixture tree', () => {
  expect(flattenFixtureTree(fixtureTree)).toEqual([
    {
      fixtureId: { path: 'src/foobar/index.fixture.ts', name: 'fixture3a' },
      cleanPath: ['foobar', 'fixture3a'],
    },
    {
      fixtureId: { path: 'src/foobar/index.fixture.ts', name: 'fixture3b' },
      cleanPath: ['foobar', 'fixture3b'],
    },
    {
      fixtureId: { path: 'src/__fixtures__/fixture1.ts', name: null },
      cleanPath: ['fixture1'],
    },
    {
      fixtureId: { path: 'src/__fixtures__/fixture2.ts', name: null },
      cleanPath: ['fixture2'],
    },
  ]);
});
