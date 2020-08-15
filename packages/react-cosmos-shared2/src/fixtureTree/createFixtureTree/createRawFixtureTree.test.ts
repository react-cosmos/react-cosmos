import { FixtureTreeNode } from '../shared/types';
import { createRawFixtureTree } from './createRawFixtureTree';

it('creates tree with fixture', () => {
  const paths = {
    'Dashboard.fixture.js': null,
  };
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
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates nested tree with fixture', () => {
  const paths = {
    'ui/Dashboard.fixture.js': null,
  };
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
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates tree with multi fixture', () => {
  const paths = {
    'Button.fixture.js': ['normal', 'disabled'],
  };
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      'Button.fixture': {
        data: {
          type: 'multiFixture',
          fixtureIds: {
            normal: { path: 'Button.fixture.js', name: 'normal' },
            disabled: { path: 'Button.fixture.js', name: 'disabled' },
          },
        },
      },
    },
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});

it('creates nested tree with multi fixture', () => {
  const paths = {
    'ui/Button.fixture.js': ['normal', 'disabled'],
  };
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      ui: {
        data: { type: 'fileDir' },
        children: {
          'Button.fixture': {
            data: {
              type: 'multiFixture',
              fixtureIds: {
                normal: { path: 'ui/Button.fixture.js', name: 'normal' },
                disabled: { path: 'ui/Button.fixture.js', name: 'disabled' },
              },
            },
          },
        },
      },
    },
  };
  expect(createRawFixtureTree(paths)).toEqual(tree);
});
