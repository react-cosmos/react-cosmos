// WARNING: Module mocks need to be imported before the mocked modules are
// imported, which are sometimes imported indirectly by the modules being
// tested. Otherwise the mocks will be applied too late and the tests will run
// against the unmocked original modules instead.
import { mockCosmosConfig, resetFsMock } from '../../testHelpers/mockFs.js';
import { mockCliArgs, unmockCliArgs } from '../../testHelpers/mockYargs.js';

// NOTE: This is the only config test file where the config file is mocked.
// Mocking the config file provides extra coverage, but the rest of the test
// files instantiate a CosmosConfig class by hand to minimize boilerplate.
import { detectCosmosConfig } from '../detectCosmosConfig.js';

afterEach(async () => {
  await unmockCliArgs();
  await resetFsMock();
});

it('returns cosmos config at --config path', async () => {
  const uniqOpt = {};
  await mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  await mockCliArgs({ config: 'subdir/cosmos.config.json' });
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --config path', async () => {
  await mockCliArgs({ config: 'subdir/cosmos.config.json' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Config not found at path: subdir/cosmos.config.json'
  );
});

it('throws on invalid --config file extension', async () => {
  await mockCliArgs({ config: 'subdir/cosmos.config.js' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Invalid config file type: subdir/cosmos.config.js (must be .json)'
  );
});

it('returns cosmos config at --root-dir path', async () => {
  const uniqOpt = {};
  await mockCosmosConfig('subdir/cosmos.config.json', { uniqOpt });
  await mockCliArgs({ rootDir: 'subdir' });
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});

it('throws on invalid --root-dir path', async () => {
  await mockCliArgs({ rootDir: 'subdir' });
  await expect(detectCosmosConfig()).rejects.toThrow(
    '[Cosmos] Dir not found at path: subdir'
  );
});

it('returns cosmos config at cwd', async () => {
  const uniqOpt = {};
  await mockCosmosConfig('cosmos.config.json', { uniqOpt });
  await mockCliArgs({});
  expect((await detectCosmosConfig()).uniqOpt).toBe(uniqOpt);
});
