import yargs from 'yargs/yargs';

export function getCliArgs() {
  return yargs(process.argv.slice(2)).boolean('lazy').parseSync();
}
