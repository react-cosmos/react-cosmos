import { mockProcessCwd, unmockProcessCwd } from './mockProcessCwd';
import { mockArgv } from './mockYargs';

type ConfigMocks = {
  cwd: string;
  cliArgs?: {};
};

// TODO: Allow mocking of config file
export function mockConfigInputs(mocks: ConfigMocks, cb: () => unknown) {
  expect.hasAssertions();
  mockProcessCwd(mocks.cwd);
  mockArgv(mocks.cliArgs || {});
  cb();
  unmockProcessCwd();
  mockArgv({});
}
