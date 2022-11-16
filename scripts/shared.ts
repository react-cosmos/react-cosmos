import chalk from 'chalk';
import { readFile, writeFile } from 'fs';
import glob from 'glob';
import rimraf from 'rimraf';
import { argv } from 'yargs';

type ArgValue = void | null | boolean | number | string;

export type PackageNames = string[];

export const globAsync = asyncify(glob);
export const readFileAsync = asyncify(readFile);
export const writeFileAsync = asyncify(writeFile);
export const rimrafAsync = asyncify(rimraf);

// Packages are built in this order
const packageMap = {
  'react-cosmos-core': true,
  'react-cosmos-dom': true,
  'react-cosmos-native': true,
  'react-cosmos': true,
  'react-cosmos-plugin-boolean-input': true,
  'react-cosmos-plugin-open-fixture': true,
  'react-cosmos-plugin-webpack': true,
};

export type Package = keyof typeof packageMap;

export const packages = Object.keys(packageMap) as Package[];

export function findPackage(pkgName: string): Package | undefined {
  return packages.find(
    // Allow shorthand names (plugin-webpack => react-cosmos-plugin-webpack, etc.)
    p => p === pkgName || p === `react-cosmos-${pkgName}`
  );
}

export function getFormattedPackageList() {
  return ['', ...packages.map(p => p)].join('\n - ');
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
