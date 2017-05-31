import path from 'path';
import slash from 'slash';
import traverse from 'traverse';
import getFilePaths from '../index';

const resolvePath = relPath => slash(path.join(__dirname, '../use-cases', relPath));

const testUseCase = ({
  useCase,
  variantion,
  input: {
    componentPaths = [],
    fixturePaths = [],
    ignore,
    getComponentName,
    getFixturePathsForComponent,
  },
  output
}) => {
  const testName = variantion ? `${useCase} (${variantion})` : useCase;
  describe(testName, () => {
    const expectation = traverse(output).map(val => (
      typeof val === 'string' ? resolvePath(`${useCase}/${val}`) : val
    ));
    let result;

    beforeAll(() => {
      result = getFilePaths({
        componentPaths: componentPaths.map(p => resolvePath(`${useCase}/${p}`)),
        fixturePaths: fixturePaths.map(p => resolvePath(`${useCase}/${p}`)),
        ignore,
        getComponentName,
        getFixturePathsForComponent,
      });
    });

    test('components', () => {
      expect(result.components).toEqual(expectation.components);
    });

    test('fixtures', () => {
      expect(result.fixtures).toEqual(expectation.fixtures);
    });
  });
};

testUseCase({
  useCase: 'relative-fixtures',
  input: {
    componentPaths: ['components'],
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'components/Foo.js',
      'nested/Bar': 'components/nested/Bar.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'components/__fixtures__/Foo/blank.js',
      },
      'nested/Bar': {
        one: 'components/__fixtures__/nested/Bar/one.js',
        two: 'components/__fixtures__/nested/Bar/two.json',
        three: 'components/__fixtures__/nested/Bar/three.jsx',
      },
    },
  }
});

testUseCase({
  useCase: 'relative-fixtures-component-dir',
  input: {
    componentPaths: ['components'],
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'components/Foo/Foo.js',
      'nested/Bar': 'components/nested/Bar/Bar.jsx'
    },
    fixtures: {
      Foo: {
        blank: 'components/Foo/__fixtures__/blank.js',
      },
      'nested/Bar': {
        one: 'components/nested/Bar/__fixtures__/one.js',
        two: 'components/nested/Bar/__fixtures__/two.json',
        three: 'components/nested/Bar/__fixtures__/three.jsx',
      }
    },
  }
});

testUseCase({
  useCase: 'relative-fixtures-component-dir-index',
  input: {
    componentPaths: ['components'],
  },
  output: {
    components: {
      Foo: 'components/Foo/index.js',
      'nested/Bar': 'components/nested/Bar/index.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'components/Foo/__fixtures__/blank.js',
      },
      'nested/Bar': {
        one: 'components/nested/Bar/__fixtures__/one.js',
        two: 'components/nested/Bar/__fixtures__/two.json',
        three: 'components/nested/Bar/__fixtures__/three.jsx',
      },
    }
  }
});

testUseCase({
  useCase: 'external-fixtures',
  input: {
    componentPaths: ['components'],
    fixturePaths: ['fixtures'],
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'components/Foo.js',
      'nested/Bar': 'components/nested/Bar.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'fixtures/Foo/blank.js',
      },
      'nested/Bar': {
        one: 'fixtures/nested/Bar/one.js',
        two: 'fixtures/nested/Bar/two.json',
        three: 'fixtures/nested/Bar/three.jsx',
      },
    }
  }
});

testUseCase({
  useCase: 'external-fixtures',
  variantion: 'trailing comma',
  input: {
    componentPaths: ['components/'],
    fixturePaths: ['fixtures/'],
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'components/Foo.js',
      'nested/Bar': 'components/nested/Bar.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'fixtures/Foo/blank.js',
      },
      'nested/Bar': {
        one: 'fixtures/nested/Bar/one.js',
        two: 'fixtures/nested/Bar/two.json',
        three: 'fixtures/nested/Bar/three.jsx',
      },
    }
  }
});

testUseCase({
  useCase: 'separate-packages',
  input: {
    componentPaths: [
      'pkgs/Foo/src/index.js',
      'pkgs/nested/Bar/src/index.jsx',
    ],
    getComponentName: componentPath => (
      componentPath.match(/pkgs\/(.+)\/src\/index/)[1]
    ),
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'pkgs/Foo/src/index.js',
      'nested/Bar': 'pkgs/nested/Bar/src/index.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'pkgs/Foo/src/__fixtures__/blank.js',
      },
      'nested/Bar': {
        one: 'pkgs/nested/Bar/src/__fixtures__/one.js',
        two: 'pkgs/nested/Bar/src/__fixtures__/two.json',
        three: 'pkgs/nested/Bar/src/__fixtures__/three.jsx',
      },
    }
  }
});

testUseCase({
  useCase: 'separate-packages-external-fixtures',
  input: {
    componentPaths: [
      'pkgs/Foo/src/index.js',
      'pkgs/nested/Bar/src/index.jsx',
    ],
    getComponentName: componentPath => (
      componentPath.match(/pkgs\/(.+)\/src\/index/)[1]
    ),
    getFixturePathsForComponent: componentName => ({
      Foo: {
        blank: resolvePath('separate-packages-external-fixtures/pkgs/Foo/fixtures/blank.js'),
      },
      'nested/Bar': {
        one: resolvePath('separate-packages-external-fixtures/pkgs/nested/Bar/fixtures/one.js'),
        two: resolvePath('separate-packages-external-fixtures/pkgs/nested/Bar/fixtures/two.json'),
        three: resolvePath('separate-packages-external-fixtures/pkgs/nested/Bar/fixtures/three.jsx'),
      },
    }[componentName]),
    ignore: [/Baz/],
  },
  output: {
    components: {
      Foo: 'pkgs/Foo/src/index.js',
      'nested/Bar': 'pkgs/nested/Bar/src/index.jsx',
    },
    fixtures: {
      Foo: {
        blank: 'pkgs/Foo/fixtures/blank.js',
      },
      'nested/Bar': {
        one: 'pkgs/nested/Bar/fixtures/one.js',
        two: 'pkgs/nested/Bar/fixtures/two.json',
        three: 'pkgs/nested/Bar/fixtures/three.jsx',
      },
    }
  }
});
