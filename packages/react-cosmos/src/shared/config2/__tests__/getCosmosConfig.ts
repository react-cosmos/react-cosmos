import { slash } from '../../slash';
import { mockConfigInputs } from '../testHelpers';
import { getCosmosConfig } from '..';

it('returns cosmos config at --config path', () => {
  const cwd = slash(__dirname, '__fsmocks__');
  const cliArgs = { config: 'config/cosmos.config.json' };

  mockConfigInputs({ cwd, cliArgs }, () => {
    expect(getCosmosConfig()).toBe(
      require('./__fsmocks__/config/cosmos.config.json')
    );
  });
});

it('returns cosmos config at --root-dir path', () => {
  const cwd = slash(__dirname, '__fsmocks__');
  const cliArgs = { rootDir: 'config' };

  mockConfigInputs({ cwd, cliArgs }, () => {
    expect(getCosmosConfig()).toBe(
      require('./__fsmocks__/config/cosmos.config.json')
    );
  });
});

it('returns cosmos config at cwd', () => {
  const cwd = slash(__dirname, '__fsmocks__/config');

  mockConfigInputs({ cwd }, () => {
    expect(getCosmosConfig()).toBe(
      require('./__fsmocks__/config/cosmos.config.json')
    );
  });
});
