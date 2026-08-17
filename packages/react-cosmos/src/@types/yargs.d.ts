declare module 'yargs/yargs' {
  import type { Argv } from 'yargs';

  interface MockedYargs {
    (
      processArgs?: ReadonlyArray<string> | string,
      cwd?: string,
      parentRequire?: NodeRequire
    ): Argv;

    __mockArgsv(newArgv: {}): void;
  }

  const MockedYargs: MockedYargs;

  export = MockedYargs;
}
