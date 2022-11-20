import { mockCosmosConfig, unmockFs } from '../../testHelpers/mockFs.js';
import '../../testHelpers/mockResolve.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

// NOTE: This is the only config test file where the config file is mocked.
// Mocking the config file provides extra coverage, but the rest of the test
// files instantiate a CosmosConfig class by hand to minimize boilerplate.
import { detectCosmosConfig } from '../detectCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
  unmockFs();
});

it('returns cosmos config at --config path', () => {
  const uniqOpt = {};
  mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect(detectCosmosConfig().uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --config path', () => {
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect(() => detectCosmosConfig()).toThrow(
    '[Cosmos] Config not found at path: subdir/cosmos.config.json'
  );
});

it('throws on invalid --config file extension', () => {
  mockCliArgs({ config: 'subdir/cosmos.config.js' });
  expect(() => detectCosmosConfig()).toThrow(
    '[Cosmos] Invalid config file type: subdir/cosmos.config.js (must be .json)'
  );
});

it('returns cosmos config at --root-dir path', () => {
  const uniqOpt = {};
  mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  mockCliArgs({ rootDir: 'subdir' });
  expect(detectCosmosConfig().uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --root-dir path', () => {
  mockCliArgs({ rootDir: 'subdir' });
  expect(() => detectCosmosConfig()).toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns cosmos config at cwd', () => {
  const uniqOpt = {};
  mockCosmosConfig('cosmos.config.json', { uniqOpt });
  mockCliArgs({});
  expect(detectCosmosConfig().uniqOpt).toBe(uniqOpt);
});
