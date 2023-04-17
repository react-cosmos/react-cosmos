// Secondary role of mocking yargs: Prevent Cosmos from intercepting the
// --config arg passed to Jest
jest.mock('yargs/yargs', () => {
  let argv = {};

  const yargs = () => ({
    boolean: () => yargs(),
    parseSync: () => argv,
  });

  yargs.__mockArgsv = (newArgv: {}) => {
    argv = newArgv;
  };

  return yargs;
});

export function mockCliArgs(cliArgs: {}) {
  requireMocked().__mockArgsv(cliArgs);
}

export function unmockCliArgs() {
  requireMocked().__mockArgsv({});
}

function requireMocked() {
  return require('yargs/yargs');
}
