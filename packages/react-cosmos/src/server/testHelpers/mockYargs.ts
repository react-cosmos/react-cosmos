// Secondary role of mocking yargs: Prevent Cosmos from intercepting the
// --config arg passed to Jest
jest.mock('yargs', () => {
  const yargs = {
    argv: {},
    __mockArgsv: (newArgv: {}) => {
      yargs.argv = newArgv;
    },
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
  return require('yargs');
}
