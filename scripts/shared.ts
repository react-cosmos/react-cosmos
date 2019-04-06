import { readFile, writeFile } from 'fs';
import glob from 'glob';
import rimraf from 'rimraf';
import { argv } from 'yargs';
import chalk from 'chalk';

type ArgValue = void | null | boolean | number | string;

export type PackageNames = string[];

export const globAsync = asyncify(glob);
export const readFileAsync = asyncify(readFile);
export const writeFileAsync = asyncify(writeFile);
export const rimrafAsync = asyncify(rimraf);

export const NODE_PACKAGES = [
  'react-cosmos-shared2',
  'react-cosmos-fixture',
  'react-cosmos'
];
export const BROWSER_PACKAGES = ['react-cosmos-playground2'];

export function getFormattedPackageList(pkgNames: PackageNames) {
  return ['', ...pkgNames].join('\n - ');
}

export function getUnnamedArg(index: number = 0): void | number | string {
  return argv._[index];
}

export function getNamedArg(name: string): ArgValue {
  return argv[name] as ArgValue;
}

export function getBoolArg(name: string): boolean {
  return getNamedArg(name) === true;
}

export function done(text: string) {
  return `${chalk.bold.inverse.green(` DONE `)} ${text}`;
}

export function error(text: string) {
  return `${chalk.bold.inverse.red(` ERROR `)} ${text}`;
}

function asyncify(fn: (...args: any[]) => any) {
  return (...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      fn(...args, (err: Error, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
