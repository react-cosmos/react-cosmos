import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
import { flattenFixtureTree } from './flattenFixtureTree';

const fixtures = {
  'src/__fixtures__/Profile.ts': null,
  'src/__fixtures__/NewsFeed.ts': null,
  'src/admin/Dashboard/index.fixture.ts': ['overview', 'stats'],
};

const fixtureTree = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture',
});

it('flattens fixture tree', () => {
  expect(flattenFixtureTree(fixtureTree)).toEqual([
    {
      fileName: 'Dashboard',
      fixtureId: {
        path: 'src/admin/Dashboard/index.fixture.ts',
        name: 'overview',
      },
      name: 'overview',
      parents: ['admin'],
    },
    {
      fileName: 'Dashboard',
      fixtureId: {
        path: 'src/admin/Dashboard/index.fixture.ts',
        name: 'stats',
      },
      name: 'stats',
      parents: ['admin'],
    },
    {
      fileName: 'Profile',
      fixtureId: { path: 'src/__fixtures__/Profile.ts', name: null },
      name: null,
      parents: [],
    },
    {
      fileName: 'NewsFeed',
      fixtureId: { path: 'src/__fixtures__/NewsFeed.ts', name: null },
      name: null,
      parents: [],
    },
  ]);
});
