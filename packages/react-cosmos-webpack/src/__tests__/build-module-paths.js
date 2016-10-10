/* eslint-disable max-len */

jest.mock('fs');
jest.mock('glob');

let fs;
let glob;
let buildModulePaths;

beforeEach(() => {
  // Mocks need to start from scratch in every test
  jest.resetModules();

  fs = require('fs');
  glob = require('glob');
  buildModulePaths = require('../build-module-paths').default;
});

describe('single path', () => {
  let components;
  let fixtures;

  beforeEach(() => {
    glob.__setMockPaths([[
      // 1st call: Searching for components
      // Query returns fixtures and tests as well. We must ignore those.
      'src/components/__fixtures__/Comment/short.js',
      'src/components/__fixtures__/Comment/long.js',
      'src/components/__tests__/Comment.js',

      'src/components/Comment.js',
      'src/components/Post.jsx',

      // This should be ignored per ignore patterns (2nd param of buildModulePaths)
      'src/components/Scrollify.js',
    ], [
      // 2nd call: Searching for fixtures of Component
      'src/components/__fixtures__/Comment/short.json',
      'src/components/__fixtures__/Comment/long.js',
    ], [
      // 3nd call: Searching for fixtures of Post (none found)
    ]]);

    ({ components, fixtures } = buildModulePaths(['src/components'], [/ify/]));
  });

  test('calls glob.sync with right paths', () => {
    const { calls } = glob.sync.mock;
    expect(calls[0][0]).toBe('src/components/**/*{.js,.jsx}');
    expect(calls[1][0]).toBe('src/components/__fixtures__/Comment/*.{js,json}');
    expect(calls[2][0]).toBe('src/components/__fixtures__/Post/*.{js,json}');
  });

  test('calls fs.realpathSync with right paths', () => {
    const { calls } = fs.realpathSync.mock;
    expect(calls[0][0]).toBe('src/components/Comment.js');
    expect(calls[1][0]).toBe('src/components/__fixtures__/Comment/short.json');
    expect(calls[2][0]).toBe('src/components/__fixtures__/Comment/long.js');
  });

  test('returns .js component path inside require call', () => {
    expect(components).toMatch(/'Comment':\(\)=>require\('\/path\/to\/project\/src\/components\/Comment.js'\)/);
  });

  test('returns .jsx component path inside require call', () => {
    expect(components).toMatch(/'Post':\(\)=>require\('\/path\/to\/project\/src\/components\/Post.jsx'\)/);
  });

  test('does not return ignored component path inside require call', () => {
    expect(components).not.toMatch(/'Scrollify':\(\)=>require\('\/path\/to\/project\/src\/components\/Scrollify.js'\)/);
  });

  test('returns .js fixture path inside require call', () => {
    expect(fixtures).toMatch(/'long':\(\)=>require\('\/path\/to\/project\/src\/components\/__fixtures__\/Comment\/long.js'\)/);
  });

  test('returns .json fixture path inside require call with loader', () => {
    expect(fixtures).toMatch(/'short':\(\)=>require\('.+?json-loader\/index.js!\/path\/to\/project\/src\/components\/__fixtures__\/Comment\/short.json'\)/);
  });

  test('returns valid components code', () => {
    let c;
    // eslint-disable-next-line no-eval
    eval(`c = ${components};`);

    expect(c.Comment).toBeInstanceOf(Function);
    expect(c.Post).toBeInstanceOf(Function);
  });

  test('returns valid fixtures code', () => {
    let f;
    // eslint-disable-next-line no-eval
    eval(`f = ${fixtures};`);

    expect(f.Comment.long).toBeInstanceOf(Function);
    expect(f.Comment.short).toBeInstanceOf(Function);
  });
});

describe('multiple paths', () => {
  let components;
  let fixtures;

  beforeEach(() => {
    glob.__setMockPaths([[
      // 1st call: Searching for components in 'scr/components'
      // Query returns fixtures and tests as well. We must ignore those.
      'src/components/__fixtures__/Comment/short.js',
      'src/components/__fixtures__/Comment/long.js',
      'src/components/__tests__/Comment.js',

      'src/components/Comment.js',
    ], [
      // 2nd call: Searching for fixtures of Component
      'src/components/__fixtures__/Comment/short.json',
      'src/components/__fixtures__/Comment/long.js',
    ], [
      // 3st call: Searching for components in 'scr/containers'
      // Query returns fixtures and tests as well. We must ignore those.
      'src/containers/__fixtures__/App/loading.js',
      'src/containers/__fixtures__/App/loaded.js',

      'src/containers/App.js',
    ], [
      // 4th call: Searching for fixtures of App
      'src/containers/__fixtures__/App/loading.js',
      'src/containers/__fixtures__/App/loaded.js',
    ]]);

    ({ components, fixtures } = buildModulePaths(['src/components', 'src/containers']));
  });

  test('calls glob.sync with right paths', () => {
    const { calls } = glob.sync.mock;
    expect(calls[0][0]).toBe('src/components/**/*{.js,.jsx}');
    expect(calls[1][0]).toBe('src/components/__fixtures__/Comment/*.{js,json}');
    expect(calls[2][0]).toBe('src/containers/**/*{.js,.jsx}');
    expect(calls[3][0]).toBe('src/containers/__fixtures__/App/*.{js,json}');
  });

  test('calls fs.realpathSync with right paths', () => {
    const { calls } = fs.realpathSync.mock;
    expect(calls[0][0]).toBe('src/components/Comment.js');
    expect(calls[1][0]).toBe('src/components/__fixtures__/Comment/short.json');
    expect(calls[2][0]).toBe('src/components/__fixtures__/Comment/long.js');
    expect(calls[3][0]).toBe('src/containers/App.js');
    expect(calls[4][0]).toBe('src/containers/__fixtures__/App/loading.js');
    expect(calls[5][0]).toBe('src/containers/__fixtures__/App/loaded.js');
  });

  test('returns component path inside require call', () => {
    expect(components).toMatch(/'Comment':\(\)=>require\('\/path\/to\/project\/src\/components\/Comment.js'\)/);
  });

  test('returns container path inside require call', () => {
    expect(components).toMatch(/'App':\(\)=>require\('\/path\/to\/project\/src\/containers\/App.js'\)/);
  });

  test('returns fixture paths of components inside require calls', () => {
    expect(fixtures).toMatch(/'long':\(\)=>require\('\/path\/to\/project\/src\/components\/__fixtures__\/Comment\/long.js'\)/);
    expect(fixtures).toMatch(/'short':\(\)=>require\('.+?json-loader\/index.js!\/path\/to\/project\/src\/components\/__fixtures__\/Comment\/short.json'\)/);
  });

  test('returns fixture paths of containers inside require calls', () => {
    expect(fixtures).toMatch(/'loading':\(\)=>require\('\/path\/to\/project\/src\/containers\/__fixtures__\/App\/loading.js'\)/);
    expect(fixtures).toMatch(/'loaded':\(\)=>require\('\/path\/to\/project\/src\/containers\/__fixtures__\/App\/loaded.js'\)/);
  });

  test('returns valid components code', () => {
    let c;
    // eslint-disable-next-line no-eval
    eval(`c = ${components};`);

    expect(c.Comment).toBeInstanceOf(Function);
    expect(c.App).toBeInstanceOf(Function);
  });

  test('returns valid fixtures code', () => {
    let f;
    // eslint-disable-next-line no-eval
    eval(`f = ${fixtures};`);

    expect(f.Comment.long).toBeInstanceOf(Function);
    expect(f.Comment.short).toBeInstanceOf(Function);
    expect(f.App.loading).toBeInstanceOf(Function);
    expect(f.App.loaded).toBeInstanceOf(Function);
  });
});
