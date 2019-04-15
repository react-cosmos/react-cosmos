import path from 'path';
import { getCwdPath } from '../testHelpers';
import { CosmosConfig } from '..';

it('returns default empty globalImports', () => {
  const cosmosConfig = new CosmosConfig({});
  expect(cosmosConfig.getGlobalImports()).toEqual([]);
});

it('returns resolved (explicit) relative globalImports', () => {
  const cosmosConfig = new CosmosConfig({ globalImports: ['./src1'] });
  expect(cosmosConfig.getGlobalImports()).toEqual([getCwdPath('./src1')]);
});

it('returns resolved (implicit) relative globalImports', () => {
  const cosmosConfig = new CosmosConfig({ globalImports: ['src1'] });
  expect(cosmosConfig.getGlobalImports()).toEqual([getCwdPath('src1')]);
});

it('returns absolute globalImports', () => {
  const absImport = path.join(__dirname, '/src1');
  const cosmosConfig = new CosmosConfig({ globalImports: [absImport] });
  expect(cosmosConfig.getGlobalImports()).toEqual([absImport]);
});

it('returns resolved module globalImports', () => {
  const cosmosConfig = new CosmosConfig({ globalImports: ['react'] });
  expect(cosmosConfig.getGlobalImports()).toEqual([require.resolve('react')]);
});
