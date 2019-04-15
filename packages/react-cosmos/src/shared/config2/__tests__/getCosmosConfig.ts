import {
  mockCliArgs,
  mockCosmosConfig,
  unmockCliArgs,
  unmockFs
} from '../testHelpers';
import { getCosmosConfig } from '..';

afterEach(() => {
  unmockCliArgs();
  unmockFs();
});

it('returns cosmos config at --config path', () => {
  const cosmosConfig = {};
  mockCosmosConfig('subdir/cosmos.config.json', cosmosConfig);
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect(getCosmosConfig()).toBe(cosmosConfig);
});

it('throws on invalid --config path', () => {
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect(() => getCosmosConfig()).toThrow(
    '[Cosmos] Config not found at path: subdir/cosmos.config.json'
  );
});

it('throws on invalid --config file extension', () => {
  mockCliArgs({ config: 'subdir/cosmos.config.js' });
  expect(() => getCosmosConfig()).toThrow(
    '[Cosmos] Invalid config file type: subdir/cosmos.config.js (must be .json)'
  );
});

it('returns cosmos config at --root-dir path', () => {
  const cosmosConfig = {};
  mockCosmosConfig('subdir/cosmos.config.json', cosmosConfig);
  mockCliArgs({ rootDir: 'subdir' });
  expect(getCosmosConfig()).toBe(cosmosConfig);
});

it('throws on invalid --root-dir path', () => {
  mockCliArgs({ rootDir: 'subdir' });
  expect(() => getCosmosConfig()).toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns cosmos config at cwd', () => {
  const cosmosConfig = {};
  mockCosmosConfig('cosmos.config.json', cosmosConfig);
  mockCliArgs({});
  expect(getCosmosConfig()).toBe(cosmosConfig);
});
