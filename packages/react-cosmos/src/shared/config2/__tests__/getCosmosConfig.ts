import { slash } from '../../slash';
import { mockProcessCwd } from '../testHelpers/mockProcessCwd';
import { mockArgv } from '../testHelpers/mockYargs';
import { getCosmosConfig } from '..';

it('returns cosmos config at --config path', () => {
  mockProcessCwd(slash(__dirname, '__fsmocks__'));
  mockArgv({ config: 'config/cosmos.config.json' });

  expect(getCosmosConfig()).toBe(
    require('./__fsmocks__/config/cosmos.config.json')
  );
});

it('returns cosmos config at --root-dir path', () => {
  mockProcessCwd(slash(__dirname, '__fsmocks__'));
  mockArgv({ rootDir: 'config' });

  expect(getCosmosConfig()).toBe(
    require('./__fsmocks__/config/cosmos.config.json')
  );
});

it('returns cosmos config at cwd', () => {
  mockProcessCwd(slash(__dirname, '__fsmocks__/config'));
  mockArgv({});

  expect(getCosmosConfig()).toBe(
    require('./__fsmocks__/config/cosmos.config.json')
  );
});
