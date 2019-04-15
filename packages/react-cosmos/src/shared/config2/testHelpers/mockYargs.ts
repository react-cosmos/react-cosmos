// @ts-ignore
export { __mockArgsv as mockArgv } from 'yargs';

jest.mock('yargs', () => {
  const yargs = {
    argv: {},
    __mockArgsv: (newArgv: {}) => {
      yargs.argv = newArgv;
    }
  };
  return yargs;
});
