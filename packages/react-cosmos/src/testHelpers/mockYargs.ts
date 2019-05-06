// @ts-ignore
import { __mockArgsv } from 'yargs';

// Secondary role of mocking yargs: Prevent Cosmos from intercepting the
// --config arg passed to Jest
jest.mock('yargs', () => {
  const yargs = {
    argv: {},
    __mockArgsv: (newArgv: {}) => {
      yargs.argv = newArgv;
    }
  };
  return yargs;
});

export function mockCliArgs(cliArgs: {}) {
  __mockArgsv(cliArgs);
}

export function unmockCliArgs() {
  __mockArgsv({});
}
