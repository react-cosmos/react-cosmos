import { createFixtureTree } from '../../shared/fixtureTree';
import { flattenFixtureTree } from './flattenFixtureTree';

const fixtures = {
  'src/__fixtures__/fixture1.ts': null,
  'src/__fixtures__/fixture2.ts': null,
  'src/foobar/index.fixture.ts': ['fixture3a', 'fixture3b']
};

const fixtureTree = createFixtureTree({
  fixtures,
  fixturesDir: '__fixtures__',
  fixtureFileSuffix: 'fixture'
});

it('flattens fixture tree', () => {
  expect(flattenFixtureTree(fixtureTree)).toEqual({
    fixture1: { path: 'src/__fixtures__/fixture1.ts', name: null },
    fixture2: { path: 'src/__fixtures__/fixture2.ts', name: null },
    'foobar fixture3a': {
      path: 'src/foobar/index.fixture.ts',
      name: 'fixture3a'
    },
    'foobar fixture3b': {
      path: 'src/foobar/index.fixture.ts',
      name: 'fixture3b'
    }
  });
});
