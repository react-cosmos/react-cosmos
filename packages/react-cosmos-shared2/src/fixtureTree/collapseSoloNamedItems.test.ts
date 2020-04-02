import { collapseSoloNamedItems } from './collapseSoloNamedItems';

it('collapses solo named item', () => {
  const tree = {
    items: {},
    dirs: {
      SuccessMessage: {
        items: {
          SuccessMessage: {
            path: 'SuccessMessage/SuccessMessage.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
  };
  const collapsedTree = {
    items: {
      SuccessMessage: {
        path: 'SuccessMessage/SuccessMessage.fixture.js',
        name: null
      }
    },
    dirs: {}
  };
  expect(collapseSoloNamedItems(tree)).toEqual(collapsedTree);
});

it('collapses solo named item (case insensitive)', () => {
  const tree = {
    items: {},
    dirs: {
      successMessage: {
        items: {
          SuccessMessage: {
            path: 'successMessage/SuccessMessage.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
  };
  const collapsedTree = {
    items: {
      SuccessMessage: {
        path: 'successMessage/SuccessMessage.fixture.js',
        name: null
      }
    },
    dirs: {}
  };
  expect(collapseSoloNamedItems(tree)).toEqual(collapsedTree);
});
