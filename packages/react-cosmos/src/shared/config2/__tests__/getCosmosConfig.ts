import { mockCliArgs, mockCosmosConfig } from '../testHelpers';
import { getCosmosConfig } from '..';

it('returns cosmos config at --config path', () => {
  const cosmosConfig = {};
  mockCosmosConfig('subdir/cosmos.config.json', cosmosConfig, () => {
    mockCliArgs({ config: 'subdir/cosmos.config.json' }, () => {
      expect(getCosmosConfig()).toBe(cosmosConfig);
    });
  });
});

it('throws on invalid --config path', () => {
  mockCliArgs({ config: 'subdir/cosmos.config.json' }, () => {
    expect(() => getCosmosConfig()).toThrow(
      '[Cosmos] No file found at path: subdir/cosmos.config.json'
    );
  });
});

it('returns cosmos config at --root-dir path', () => {
  const cosmosConfig = {};
  mockCosmosConfig('subdir/cosmos.config.json', cosmosConfig, () => {
    mockCliArgs({ rootDir: 'subdir' }, () => {
      expect(getCosmosConfig()).toBe(cosmosConfig);
    });
  });
});

it('returns cosmos config at cwd', () => {
  const cosmosConfig = {};
  mockCosmosConfig('cosmos.config.json', cosmosConfig, () => {
    mockCliArgs({}, () => {
      expect(getCosmosConfig()).toBe(cosmosConfig);
    });
  });
});
