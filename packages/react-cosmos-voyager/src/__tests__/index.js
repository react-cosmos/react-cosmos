import path from 'path';
import slash from 'slash';
import traverse from 'traverse';
import getFilePaths from '../index';

const resolvePath = relPath => slash(path.join(__dirname, '../use-cases', relPath));

const testUseCase = (useCase, {
  componentPaths = [],
  fixturePaths = [],
  ignore,
  getComponentName,
  getFixturePathsForComponent,
}, output, inputVariation) => {
  const testName = inputVariation ? `${useCase} (${inputVariation})` : useCase;
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

testUseCase('relative-fixtures', {
  componentPaths: ['components'],
  ignore: [/Baz/],
}, {
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
});

testUseCase('relative-fixtures-component-dir', {
  componentPaths: ['components'],
  ignore: [/Baz/],
}, {
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
});

testUseCase('relative-fixtures-component-dir-index', {
  componentPaths: ['components'],
}, {
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
  },
});

testUseCase('external-fixtures', {
  componentPaths: ['components'],
  fixturePaths: ['fixtures'],
  ignore: [/Baz/],
}, {
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
  },
});

testUseCase('external-fixtures', {
  componentPaths: ['components/'],
  fixturePaths: ['fixtures/'],
  ignore: [/Baz/],
}, {
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
  },
}, 'trailing commas');

testUseCase('separate-packages', {
  componentPaths: [
    'pkgs/Foo/src/index.js',
    'pkgs/nested/Bar/src/index.jsx',
  ],
  getComponentName: componentPath => (
    componentPath.match(/pkgs\/(.+)\/src\/index/)[1]
  ),
  ignore: [/Baz/],
}, {
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
  },
});

testUseCase('separate-packages-external-fixtures', {
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
}, {
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
  },
});
