import path from 'path';
import glob from 'glob';
import traverse from 'traverse';
import getFilePaths from '../index';

const resolvePath = relPath => path.join(__dirname, '../use-cases', relPath);

const testUseCase = (useCase, {
  componentPaths = [],
  fixturePaths = [],
  ignore,
  getComponentName,
  getFixturePathsForComponent,
}, output) => {
  describe(useCase, () => {
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
    },
  },
});

testUseCase('relative-fixtures-component-dir', {
  componentPaths: ['components'],
  ignore: [/Baz/],
}, {
  components: {
    Foo: 'components/Foo/Foo.js',
    'nested/Bar': 'components/nested/Bar/Bar.jsx',
  },
  fixtures: {
    Foo: {
      blank: 'components/Foo/__fixtures__/blank.js',
    },
    'nested/Bar': {
      one: 'components/nested/Bar/__fixtures__/one.js',
      two: 'components/nested/Bar/__fixtures__/two.json',
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
    },
  },
});

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
    },
  },
});
