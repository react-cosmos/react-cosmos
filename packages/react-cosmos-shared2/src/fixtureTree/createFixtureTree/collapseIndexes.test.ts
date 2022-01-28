import { FixtureTreeNode } from '../shared/types';
import { collapseIndexes } from './collapseIndexes';

it('collapses index fixture', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/index.fixture.js' },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: {
          type: 'fixture',
          fixtureId: { path: 'Dashboard/index.fixture.js' },
        },
      },
    },
  };
  expect(collapseIndexes(tree)).toEqual(collapsedTree);
});

it('collapses index multi fixture', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Button: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'multiFixture',
              fixtureIds: {
                normal: { path: 'Button/index.fixture.js', name: 'normal' },
                disabled: { path: 'Button/index.fixture.js', name: 'disabled' },
              },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Button: {
        data: {
          type: 'multiFixture',
          fixtureIds: {
            normal: { path: 'Button/index.fixture.js', name: 'normal' },
            disabled: { path: 'Button/index.fixture.js', name: 'disabled' },
          },
        },
      },
    },
  };
  expect(collapseIndexes(tree)).toEqual(collapsedTree);
});

it('does not collapse index fixture with sibling', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/index.fixture.js' },
            },
          },
          Settings: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/Settings.fixture.js' },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/index.fixture.js' },
            },
          },
          Settings: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/Settings.fixture.js' },
            },
          },
        },
      },
    },
  };
  expect(collapseIndexes(tree)).toEqual(collapsedTree);
});

it('only collapses index fixture without sibling', () => {
  const tree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/index.fixture.js' },
            },
          },
          Settings: {
            data: { type: 'fileDir' },
            children: {
              index: {
                data: {
                  type: 'fixture',
                  fixtureId: { path: 'Dashboard/Settings/index.fixture.js' },
                },
              },
            },
          },
        },
      },
    },
  };
  const collapsedTree: FixtureTreeNode = {
    data: { type: 'fileDir' },
    children: {
      Dashboard: {
        data: { type: 'fileDir' },
        children: {
          index: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/index.fixture.js' },
            },
          },
          Settings: {
            data: {
              type: 'fixture',
              fixtureId: { path: 'Dashboard/Settings/index.fixture.js' },
            },
          },
        },
      },
    },
  };
  expect(collapseIndexes(tree)).toEqual(collapsedTree);
});
