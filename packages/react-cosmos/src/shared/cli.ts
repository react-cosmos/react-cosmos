import yargs from 'yargs';

export function getCliArgs() {
  return yargs.argv as {
    _: Array<string | number>;
    $0: string;
    [argName: string]: unknown;
  };
}
