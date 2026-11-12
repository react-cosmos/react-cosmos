import path from 'node:path';
import { createCosmosConfig } from '../cosmosConfig/createCosmosConfig.js';
import { isIgnoredPath, isUserModulePath } from './userModulePath.js';

const rootDir = path.resolve('/project');
const config = createCosmosConfig(rootDir);

function rootPath(relPath: string) {
  return path.join(rootDir, relPath);
}

it('matches fixture files', () => {
  expect(isUserModulePath(config, rootPath('src/Button.fixture.tsx'))).toBe(
    true
  );
  expect(isUserModulePath(config, rootPath('src/fixture.jsx'))).toBe(true);
});

it('matches files in fixtures dirs', () => {
  expect(isUserModulePath(config, rootPath('src/__fixtures__/Button.md'))).toBe(
    true
  );
});

it('matches decorator files', () => {
  expect(isUserModulePath(config, rootPath('src/cosmos.decorator.tsx'))).toBe(
    true
  );
});

it('matches user modules in the root dir', () => {
  expect(isUserModulePath(config, rootPath('cosmos.decorator.tsx'))).toBe(true);
  expect(isUserModulePath(config, rootPath('__fixtures__/Button.tsx'))).toBe(
    true
  );
});

it('matches custom fixture suffix and fixtures dir', () => {
  const customConfig = createCosmosConfig(rootDir, {
    fixtureFileSuffix: 'story',
    fixturesDir: '__stories__',
  });
  expect(isUserModulePath(customConfig, rootPath('src/Button.story.tsx'))).toBe(
    true
  );
  expect(
    isUserModulePath(customConfig, rootPath('src/__stories__/Button.tsx'))
  ).toBe(true);
});

it('ignores files that are neither fixtures nor decorators', () => {
  expect(isUserModulePath(config, rootPath('src/Button.tsx'))).toBe(false);
  expect(isUserModulePath(config, rootPath('src/Button.fixture.css'))).toBe(
    false
  );
});

it('ignores fixture files in ignored paths', () => {
  const filePath = rootPath('node_modules/pkg/Button.fixture.tsx');
  expect(isIgnoredPath(config, filePath)).toBe(true);
  expect(isUserModulePath(config, filePath)).toBe(false);
});

it('ignores fixture files in custom ignored paths', () => {
  const customConfig = createCosmosConfig(rootDir, {
    ignore: ['**/legacy/**'],
  });
  const filePath = rootPath('src/legacy/Button.fixture.tsx');
  expect(isIgnoredPath(customConfig, filePath)).toBe(true);
  expect(isUserModulePath(customConfig, filePath)).toBe(false);
});

it('ignores dot fixture files', () => {
  const filePath = rootPath('src/.Button.fixture.tsx');
  expect(isIgnoredPath(config, filePath)).toBe(true);
  expect(isUserModulePath(config, filePath)).toBe(false);
});

it('ignores fixture files in dot dirs', () => {
  const filePath = rootPath('.cache/src/Button.fixture.tsx');
  expect(isIgnoredPath(config, filePath)).toBe(true);
  expect(isUserModulePath(config, filePath)).toBe(false);
});

it('ignores fixture files outside the root dir', () => {
  const filePath = path.resolve('/other/Button.fixture.tsx');
  expect(isIgnoredPath(config, filePath)).toBe(true);
  expect(isUserModulePath(config, filePath)).toBe(false);
});

it.runIf(process.platform === 'win32')(
  'ignores fixture files on another drive',
  () => {
    const drive = rootDir.startsWith('Z:') ? 'Y:' : 'Z:';
    const filePath = `${drive}\\Button.fixture.tsx`;
    expect(isIgnoredPath(config, filePath)).toBe(true);
    expect(isUserModulePath(config, filePath)).toBe(false);
  }
);

it("doesn't ignore the root dir or regular dirs", () => {
  expect(isIgnoredPath(config, rootDir)).toBe(false);
  expect(isIgnoredPath(config, rootPath('src/components'))).toBe(false);
});
