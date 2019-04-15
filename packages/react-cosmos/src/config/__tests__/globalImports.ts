import path from 'path';
import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns default empty globalImports', () => {
  const { globalImports } = new CosmosConfig({});
  expect(globalImports).toEqual([]);
});

it('returns resolved (explicit) relative globalImports', () => {
  const { globalImports } = new CosmosConfig({ globalImports: ['./src1'] });
  expect(globalImports).toEqual([getCwdPath('./src1')]);
});

it('returns resolved (implicit) relative globalImports', () => {
  const { globalImports } = new CosmosConfig({ globalImports: ['src1'] });
  expect(globalImports).toEqual([getCwdPath('src1')]);
});

it('returns absolute globalImports', () => {
  const absImport = path.join(__dirname, '/src1');
  const { globalImports } = new CosmosConfig({ globalImports: [absImport] });
  expect(globalImports).toEqual([absImport]);
});

it('returns resolved module globalImports', () => {
  const { globalImports } = new CosmosConfig({ globalImports: ['react'] });
  expect(globalImports).toEqual([require.resolve('react')]);
});
