import path from 'path';
import traverse from 'traverse';
import getFilePaths from '../index';

const resolvePath = relPath => path.join(__dirname, 'use-cases', relPath);

const testUseCase = (useCase, {
  componentPaths = [],
  fixturePaths = [],
  getComponentName,
  ignore,
}, output) => {
  test(useCase, () => {
    expect(getFilePaths({
      componentPaths: componentPaths.map(p => resolvePath(p)),
      fixturePaths: fixturePaths.map(p => resolvePath(p)),
      getComponentName,
      ignore,
    })).toEqual(
      traverse(output).map(val => (
        typeof val === 'string' ? resolvePath(val) : val
      )),
    );
  });
};

testUseCase('relative-fixtures', {
  componentPaths: ['components'],
  ignore: [/Baz/, /three/],
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
      two: 'components/__fixtures__/nested/Bar/two.js',
    },
  },
});

testUseCase('relative-fixtures-component-dir', {
  componentPaths: ['components'],
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
      two: 'components/nested/Bar/__fixtures__/two.js',
    },
  },
});

testUseCase('external-fixtures', {
  componentPaths: ['components'],
  fixturePaths: ['fixtures'],
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
      one: 'fixtures/Bar/one.js',
      two: 'fixtures/Bar/two.js',
    },
  },
});

testUseCase('separate-packages', {
  componentPaths: [
    'packages/Foo/src/index.js',
    'packages/nested/Bar/src/index.jsx',
  ],
  getComponentName: componentPath => (
    componentPath.match(/packages\/(.+)\/src\/index/)[1]
  ),
}, {
  components: {
    Foo: 'packages/Foo/src/index.js',
    'nested/Bar': 'packages/nested/Bar/src/index.jsx',
  },
  fixtures: {
    Foo: {
      blank: 'packages/Foo/src/__fixtures__/blank.js',
    },
    'nested/Bar': {
      one: 'packages/nested/Bar/src/__fixtures__/one.js',
      two: 'packages/nested/Bar/src/__fixtures__/two.js',
    },
  },
});

testUseCase('separate-packages-external-fixtures', {
  componentPaths: [
    'packages/Foo/src/index.js',
    'packages/nested/Bar/src/index.jsx',
  ],
  fixturePaths: ['fixtures'],
  getComponentName: componentPath => (
    componentPath.match(/packages\/(.+)\/src\/index/)[1]
  ),
}, {
  components: {
    Foo: 'packages/Foo/src/index.js',
    'nested/Bar': 'packages/nested/Bar/src/index.jsx',
  },
  fixtures: {
    Foo: {
      blank: 'fixtures/Foo/blank.js',
    },
    'nested/Bar': {
      one: 'fixtures/nested/Bar/one.js',
      two: 'fixtures/nested/Bar/two.js',
    },
  },
});
