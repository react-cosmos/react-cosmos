import { FixtureTreeNode } from '../shared/types';
import { hideFixtureSuffix } from './hideFixtureSuffix';

it('hides fixture suffix', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      'Dashboard.fixture': {
        data: {
          type: 'fixture',
          fixtureId: { path: 'Dashboard.fixture.js', name: null },
        },
      },
    },
  };
  const cleanTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: {
          type: 'fixture',
          fixtureId: { path: 'Dashboard.fixture.js', name: null },
        },
      },
    },
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});

it('hides nested fixture suffix', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          'Dashboard.fixture': {
            data: {
              type: 'fixture',
              fixtureId: { path: 'ui/Dashboard.fixture.js', name: null },
            },
          },
        },
      },
    },
  };
  const cleanTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          Dashboard: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'ui/Dashboard.fixture.js', name: null },
            },
          },
        },
      },
    },
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});
