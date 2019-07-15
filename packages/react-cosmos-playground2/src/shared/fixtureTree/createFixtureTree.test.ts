import { createFixtureTree } from './createFixtureTree';

it('create tree with single fixture', () => {
  const paths = {
    'helloWorld.fixture.js': null
  };
  const tree = {
    dirs: {},
    items: {
      'helloWorld.fixture': {
        name: null,
        path: 'helloWorld.fixture.js'
      }
    }
  };
  expect(createFixtureTree(paths)).toEqual(tree);
});

it('create tree with multi fixture', () => {
  const paths = {
    'index.fixture.js': ['Susan', 'Sarah']
  };
  const tree = {
    dirs: {
      'index.fixture': {
        dirs: {},
        items: {
          Susan: {
            name: 'Susan',
            path: 'index.fixture.js'
          },
          Sarah: {
            name: 'Sarah',
            path: 'index.fixture.js'
          }
        }
      }
    },
    items: {}
  };
  expect(createFixtureTree(paths)).toEqual(tree);
});
