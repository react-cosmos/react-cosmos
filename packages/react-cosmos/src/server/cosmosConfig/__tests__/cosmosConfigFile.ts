// Import mocks first
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

// NOTE: This is the only config test file where the config file is mocked.
// Mocking the config file provides extra coverage, but the rest of the test
// files instantiate a CosmosConfig class by hand to minimize boilerplate.
import { detectCosmosConfig } from '../detectCosmosConfig.js';

afterEach(() => {
  unmockCliArgs();
  resetFsMock();
});

it('returns cosmos config at --config path', async () => {
  const uniqOpt = {};
  mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --config path', async () => {
  mockCliArgs({ config: 'subdir/cosmos.config.json' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Config not found at path: subdir/cosmos.config.json'
  );
});

it('throws on invalid --config file extension', async () => {
  mockCliArgs({ config: 'subdir/cosmos.config.js' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Invalid config file type: subdir/cosmos.config.js (must be .json)'
  );
});

it('returns cosmos config at --root-dir path', async () => {
  const uniqOpt = {};
  mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  mockCliArgs({ rootDir: 'subdir' });
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --root-dir path', async () => {
  mockCliArgs({ rootDir: 'subdir' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns cosmos config at cwd', async () => {
  const uniqOpt = {};
  mockCosmosConfig('cosmos.config.json', { uniqOpt });
  mockCliArgs({});
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});
