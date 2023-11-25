import { vi } from 'vitest';

// Secondary role of mocking yargs: Prevent Cosmos from intercepting the
// --config arg passed to Jest
vi.mock('yargs/yargs', () => {
  let argv = {};

  const yargs = () => ({
    boolean: () => yargs(),
    parseSync: () => argv,
  });

  yargs.__mockArgsv = (newArgv: {}) => {
    argv = newArgv;
  };

  return { default: yargs };
});

export async function mockCliArgs(cliArgs: {}) {
  (await importMocked()).default.__mockArgsv(cliArgs);
}

export async function unmockCliArgs() {
  (await importMocked()).default.__mockArgsv({});
}

async function importMocked() {
  return import('yargs/yargs');
}
