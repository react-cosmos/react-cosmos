import { RendererConfig } from 'react-cosmos-core';
import { userImportsLazyTemplate } from './userImportsLazyTemplate.js';

const globalImports = [
  '/Users/ovidiu/cosmos/src/polyfills.ts',
  '/Users/ovidiu/cosmos/src/global.css',
];

const fixturePaths = [
  '/Users/ovidiu/cosmos/src/Counter/Counter.fixture.tsx',
  '/Users/ovidiu/cosmos/src/CounterButton/CounterButton.fixture.tsx',
];

const decoratorPaths = ['/Users/ovidiu/cosmos/src/cosmos.decorator.tsx'];

const modulePaths = { fixturePaths, decoratorPaths };

const rendererConfig: RendererConfig = {
  serverAddress: 'ws://localhost:5002',
  rendererUrl: null,
};

it('should generate user imports with absolute paths', () => {
  expect(
    userImportsLazyTemplate({
      rootDir: '/Users/ovidiu/cosmos',
      modulePaths,
      globalImports,
      rendererConfig,
      relativeToDir: null,
      typeScript: false,
    })
  ).toMatchSnapshot();
});

it('should generate user imports with relative paths', () => {
  expect(
    userImportsLazyTemplate({
      rootDir: '/Users/ovidiu/cosmos',
      modulePaths,
      globalImports,
      rendererConfig,
      relativeToDir: '/Users/ovidiu/cosmos/src',
      typeScript: false,
    })
  ).toMatchSnapshot();
});

it('should generate TypeScript user imports with absolute paths', () => {
  expect(
    userImportsLazyTemplate({
      rootDir: '/Users/ovidiu/cosmos',
      modulePaths,
      globalImports,
      rendererConfig,
      relativeToDir: null,
      typeScript: true,
    })
  ).toMatchSnapshot();
});

it('should generate TypeScript user imports with relative paths', () => {
  expect(
    userImportsLazyTemplate({
      rootDir: '/Users/ovidiu/cosmos',
      modulePaths,
      globalImports,
      rendererConfig,
      relativeToDir: '/Users/ovidiu/cosmos/src',
      typeScript: true,
    })
  ).toMatchSnapshot();
});
