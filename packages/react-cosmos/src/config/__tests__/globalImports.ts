import path from 'path';
import { getCwdPath } from '../../testHelpers/cwd';
import { createCosmosConfig } from '..';

it('returns default empty globalImports', () => {
  const { globalImports } = createCosmosConfig({});
  expect(globalImports).toEqual([]);
});

it('returns resolved (explicit) relative globalImports', () => {
  const { globalImports } = createCosmosConfig({ globalImports: ['./src1'] });
  expect(globalImports).toEqual([getCwdPath('./src1')]);
});

it('returns resolved (implicit) relative globalImports', () => {
  const { globalImports } = createCosmosConfig({ globalImports: ['src1'] });
  expect(globalImports).toEqual([getCwdPath('src1')]);
});

it('returns absolute globalImports', () => {
  const absImport = path.join(__dirname, '/src1');
  const { globalImports } = createCosmosConfig({ globalImports: [absImport] });
  expect(globalImports).toEqual([absImport]);
});

it('returns resolved module globalImports', () => {
  const { globalImports } = createCosmosConfig({ globalImports: ['react'] });
  expect(globalImports).toEqual([require.resolve('react')]);
});
