import { hideFixtureSuffix } from './hideFixtureSuffix';

it('hides fixture suffix in dir name', () => {
  const tree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {},
        dirs: {
          'index.fixture': {
            items: {
              Susan: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Susan'
              },
              Sarah: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Sarah'
              }
            },
            dirs: {}
          }
        }
      }
    }
  };
  const cleanTree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {},
        dirs: {
          index: {
            items: {
              Susan: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Susan'
              },
              Sarah: {
                path: 'WelcomeMessage/index.fixture.js',
                name: 'Sarah'
              }
            },
            dirs: {}
          }
        }
      }
    }
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});

it('hides fixture suffix in item name', () => {
  const tree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {
          'index.fixture': {
            path: 'WelcomeMessage/index.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
  };
  const cleanTree = {
    items: {},
    dirs: {
      WelcomeMessage: {
        items: {
          index: {
            path: 'WelcomeMessage/index.fixture.js',
            name: null
          }
        },
        dirs: {}
      }
    }
  };
  expect(hideFixtureSuffix(tree, 'fixture')).toEqual(cleanTree);
});
