import { RendererConfig } from 'react-cosmos-core';
import { userDepsStaticTemplate } from './userDepsStaticTemplate.js';

const globalImports = [
  '/Users/ovidiu/cosmos/src/polyfills.ts',
  '/Users/ovidiu/cosmos/src/global.css',
];

const fixturePaths = [
  '/Users/ovidiu/cosmos/src/Counter/Counter.fixture.tsx',
  '/Users/ovidiu/cosmos/src/CounterButton/CounterButton.fixture.tsx',
];

const decoratorPaths = ['/Users/ovidiu/cosmos/src/cosmos.decorator.tsx'];

const rendererConfig: RendererConfig = {
  playgroundUrl: 'http://localhost:5002',
};

it('should generate user deps module with absolute paths', () => {
  expect(
    userDepsStaticTemplate({
      globalImports,
      fixturePaths,
      decoratorPaths,
      rendererConfig,
      rootDir: '/Users/ovidiu/cosmos/',
      relativeToDir: null,
    })
  ).toMatchSnapshot();
});

it('should generate user deps module with relative paths', () => {
  expect(
    userDepsStaticTemplate({
      globalImports,
      fixturePaths,
      decoratorPaths,
      rendererConfig,
      rootDir: '/Users/ovidiu/cosmos',
      relativeToDir: '/Users/ovidiu/cosmos/src',
    })
  ).toMatchSnapshot();
});
