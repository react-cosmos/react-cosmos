declare module 'yargs/yargs' {
  import { Argv } from 'yargs';

  declare interface MockedYargs {
    (
      processArgs?: ReadonlyArray<string> | string,
      cwd?: string,
      parentRequire?: NodeRequire
    ): Argv;

    __mockArgsv(newArgv: {}): void;
  }

  declare const MockedYargs: MockedYargs;

  export = MockedYargs;
}
