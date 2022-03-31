import chalk from 'chalk';
import { readFile, writeFile } from 'fs';
import glob from 'glob';
import rimraf from 'rimraf';
import { getCliArgs } from 'react-cosmos/src/server/cli';

type ArgValue = void | null | boolean | number | string;

export type PackageNames = string[];

export const globAsync = asyncify(glob);
export const readFileAsync = asyncify(readFile);
export const writeFileAsync = asyncify(writeFile);
export const rimrafAsync = asyncify(rimraf);

export enum PackageType {
  Node,
  Browser,
}

export type NodePackage = {
  type: PackageType.Node;
  name: string;
};

export type BrowserPackage = {
  type: PackageType.Browser;
  name: string;
};

export type Package = NodePackage | BrowserPackage;

const cliArgs = getCliArgs();

// Warning: The order matters!
export const packages: Package[] = [
  { type: PackageType.Node, name: 'react-cosmos-shared2' },
  { type: PackageType.Node, name: 'react-cosmos-plugin' },
  { type: PackageType.Browser, name: 'react-cosmos-playground2' },
  { type: PackageType.Browser, name: 'react-cosmos-plugin-open-fixture' },
  { type: PackageType.Node, name: 'react-cosmos' },
];

export function findPackage(pkgName: string) {
  return packages.find(
    // Allow shorthand names (shared => react-cosmos-shared2, etc.)
    p => p.name === pkgName || p.name === `react-cosmos-${pkgName}`
  );
}

export function getFormattedPackageList() {
  return ['', ...packages.map(p => p.name)].join('\n - ');
}

export function getUnnamedArg(index: number = 0): void | number | string {
  return cliArgs._[index];
}

export function getNamedArg(name: string): ArgValue {
  return cliArgs[name] as ArgValue;
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
