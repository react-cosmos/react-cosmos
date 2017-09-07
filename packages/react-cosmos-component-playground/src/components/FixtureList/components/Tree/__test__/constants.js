export const PATH_TO_FOO = 'components/foo';
export const PATH_TO_BAZ = 'components/Baz';
export const PATH_TO_TAR_INDEX = 'components/Baz/components/Tar/index';

export const initialTreeFromFixtures = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        open: true,
        isLeaf: true,
        path: 'components/foo'
      },
      bar: {
        name: 'bar',
        value: {
          component: 'components',
          fixture: 'bar'
        },
        open: true,
        isLeaf: true,
        path: 'components/bar'
      },
      Shazam: {
        name: 'Shazam',
        value: undefined,
        open: true,
        path: 'components/Shazam'
      },
      Baz: {
        name: 'Baz',
        open: true,
        path: 'components/Baz',
        children: {
          fooBaz: {
            name: 'fooBaz',
            value: {
              component: 'components/Baz',
              fixture: 'fooBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/fooBaz'
          },
          barBaz: {
            name: 'barBaz',
            value: {
              component: 'components/Baz',
              fixture: 'barBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/barBaz'
          },
          components: {
            name: 'components',
            open: true,
            path: 'components/Baz/components',
            children: {
              Tar: {
                name: 'Tar',
                open: true,
                path: 'components/Baz/components/Tar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Tar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Tar/index'
                  }
                }
              },
              Lar: {
                name: 'Lar',
                open: true,
                path: 'components/Baz/components/Lar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Lar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Lar/index'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const initialPathsOutput = {
  'components/foo': {
    component: 'components',
    fixture: 'foo'
  },
  'components/bar': {
    component: 'components',
    fixture: 'bar'
  },
  'components/Shazam': undefined,
  'components/Baz/fooBaz': {
    component: 'components/Baz',
    fixture: 'fooBaz'
  },
  'components/Baz/barBaz': {
    component: 'components/Baz',
    fixture: 'barBaz'
  },
  'components/Baz/components/Tar/index': {
    component: 'components/Baz/components/Tar',
    fixture: 'index'
  },
  'components/Baz/components/Lar/index': {
    component: 'components/Baz/components/Lar',
    fixture: 'index'
  }
};

export const fooPaths = {
  'components/foo': {
    component: 'components',
    fixture: 'foo'
  }
};

export const foofixtures = {
  components: ['foo']
};

export const treeFromFirstPath = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        path: 'components/foo',
        isLeaf: true,
        open: true
      }
    }
  }
};

export const updatedTreeFromFirstPath = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        path: 'components/foo',
        open: true,
        active: true,
        isLeaf: true
      }
    }
  }
};

export const treeWtihFooSelected = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        open: true,
        isLeaf: true,
        active: true,
        path: 'components/foo'
      },
      bar: {
        name: 'bar',
        value: {
          component: 'components',
          fixture: 'bar'
        },
        open: true,
        isLeaf: true,
        path: 'components/bar'
      },
      Shazam: {
        name: 'Shazam',
        value: undefined,
        open: true,
        path: 'components/Shazam'
      },
      Baz: {
        name: 'Baz',
        open: true,
        path: 'components/Baz',
        children: {
          fooBaz: {
            name: 'fooBaz',
            value: {
              component: 'components/Baz',
              fixture: 'fooBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/fooBaz'
          },
          barBaz: {
            name: 'barBaz',
            value: {
              component: 'components/Baz',
              fixture: 'barBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/barBaz'
          },
          components: {
            name: 'components',
            open: true,
            path: 'components/Baz/components',
            children: {
              Tar: {
                name: 'Tar',
                open: true,
                path: 'components/Baz/components/Tar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Tar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Tar/index'
                  }
                }
              },
              Lar: {
                name: 'Lar',
                open: true,
                path: 'components/Baz/components/Lar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Lar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Lar/index'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const treeWtihTarSelected = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        open: true,
        isLeaf: true,
        path: 'components/foo'
      },
      bar: {
        name: 'bar',
        value: {
          component: 'components',
          fixture: 'bar'
        },
        open: true,
        isLeaf: true,
        path: 'components/bar'
      },
      Shazam: {
        name: 'Shazam',
        value: undefined,
        open: true,
        path: 'components/Shazam'
      },
      Baz: {
        name: 'Baz',
        open: true,
        path: 'components/Baz',
        children: {
          fooBaz: {
            name: 'fooBaz',
            value: {
              component: 'components/Baz',
              fixture: 'fooBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/fooBaz'
          },
          barBaz: {
            name: 'barBaz',
            value: {
              component: 'components/Baz',
              fixture: 'barBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/barBaz'
          },
          components: {
            name: 'components',
            open: true,
            path: 'components/Baz/components',
            children: {
              Tar: {
                name: 'Tar',
                open: true,
                path: 'components/Baz/components/Tar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Tar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    active: true,
                    path: 'components/Baz/components/Tar/index'
                  }
                }
              },
              Lar: {
                name: 'Lar',
                open: true,
                path: 'components/Baz/components/Lar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Lar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Lar/index'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const treeWtihTarAndFooSelected = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        open: true,
        isLeaf: true,
        active: true,
        path: 'components/foo'
      },
      bar: {
        name: 'bar',
        value: {
          component: 'components',
          fixture: 'bar'
        },
        open: true,
        isLeaf: true,
        path: 'components/bar'
      },
      Shazam: {
        name: 'Shazam',
        value: undefined,
        open: true,
        path: 'components/Shazam'
      },
      Baz: {
        name: 'Baz',
        open: true,
        path: 'components/Baz',
        children: {
          fooBaz: {
            name: 'fooBaz',
            value: {
              component: 'components/Baz',
              fixture: 'fooBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/fooBaz'
          },
          barBaz: {
            name: 'barBaz',
            value: {
              component: 'components/Baz',
              fixture: 'barBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/barBaz'
          },
          components: {
            name: 'components',
            open: true,
            path: 'components/Baz/components',
            children: {
              Tar: {
                name: 'Tar',
                open: true,
                path: 'components/Baz/components/Tar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Tar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    active: true,
                    path: 'components/Baz/components/Tar/index'
                  }
                }
              },
              Lar: {
                name: 'Lar',
                open: true,
                path: 'components/Baz/components/Lar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Lar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Lar/index'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const treeWtihBazClosed = {
  components: {
    name: 'components',
    path: 'components',
    open: true,
    children: {
      foo: {
        name: 'foo',
        value: {
          component: 'components',
          fixture: 'foo'
        },
        open: true,
        isLeaf: true,
        path: 'components/foo'
      },
      bar: {
        name: 'bar',
        value: {
          component: 'components',
          fixture: 'bar'
        },
        open: true,
        isLeaf: true,
        path: 'components/bar'
      },
      Shazam: {
        name: 'Shazam',
        value: undefined,
        open: true,
        path: 'components/Shazam'
      },
      Baz: {
        name: 'Baz',
        open: false,
        path: 'components/Baz',
        children: {
          fooBaz: {
            name: 'fooBaz',
            value: {
              component: 'components/Baz',
              fixture: 'fooBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/fooBaz'
          },
          barBaz: {
            name: 'barBaz',
            value: {
              component: 'components/Baz',
              fixture: 'barBaz'
            },
            open: true,
            isLeaf: true,
            path: 'components/Baz/barBaz'
          },
          components: {
            name: 'components',
            open: true,
            path: 'components/Baz/components',
            children: {
              Tar: {
                name: 'Tar',
                open: true,
                path: 'components/Baz/components/Tar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Tar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Tar/index'
                  }
                }
              },
              Lar: {
                name: 'Lar',
                open: true,
                path: 'components/Baz/components/Lar',
                children: {
                  index: {
                    name: 'index',
                    value: {
                      component: 'components/Baz/components/Lar',
                      fixture: 'index'
                    },
                    isLeaf: true,
                    open: true,
                    path: 'components/Baz/components/Lar/index'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
