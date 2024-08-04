import { vi } from 'vitest';

// Secondary role of mocking yargs: Prevent Cosmos from intercepting the
// --config arg passed to Jest.
// Update: This doesn't seem to be the case with Vitest. The Vitest -c arg is
// not returned by yargs while running the tests, but I'll keep this commment
// in case this changes in the future.
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
