import { hideSingleChildDirs } from './hideSingleChildDirs';

it('hides one single-child root dir', () => {
  const tree = {
    dirs: {
      dir0: {
        dirs: {},
        items: {
          foo: {
            path: 'foo',
            name: null
          }
        }
      }
    },
    items: {}
  };
  expect(hideSingleChildDirs(tree)).toEqual({
    dirs: {},
    items: {
      foo: {
        path: 'foo',
        name: null
      }
    }
  });
});

it('hide all single-child root dirs', () => {
  const tree = {
    dirs: {
      dir0: {
        dirs: {
          dir1: {
            dirs: {
              dir2: {
                dirs: {},
                items: {
                  foo: {
                    path: 'foo',
                    name: null
                  }
                }
              }
            },
            items: {}
          }
        },
        items: {}
      }
    },
    items: {}
  };
  expect(hideSingleChildDirs(tree)).toEqual({
    dirs: {},
    items: {
      foo: {
        path: 'foo',
        name: null
      }
    }
  });
});

it('hides nested single-child dir', () => {
  const tree = {
    dirs: {
      src: {
        dirs: {
          header: {
            dirs: {
              Header: {
                dirs: {},
                items: {
                  mobileHeader: {
                    path: 'src/header/Header/Header.fixture',
                    name: 'mobileHeader'
                  },
                  desktopHeader: {
                    path: 'src/header/Header/Header.fixture',
                    name: 'mobileHeader'
                  }
                }
              }
            },
            items: {}
          },
          footer: {
            dirs: {},
            items: {}
          }
        },
        items: {}
      }
    },
    items: {}
  };
  expect(hideSingleChildDirs(tree)).toEqual({
    dirs: {
      Header: {
        dirs: {},
        items: {
          mobileHeader: {
            path: 'src/header/Header/Header.fixture',
            name: 'mobileHeader'
          },
          desktopHeader: {
            path: 'src/header/Header/Header.fixture',
            name: 'mobileHeader'
          }
        }
      },
      footer: {
        dirs: {},
        items: {}
      }
    },
    items: {}
  });
});
