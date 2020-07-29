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

export enum PackageType {
  Node,
  Browser,
}

export type NodePackage = {
  type: PackageType.Node;
  name: string;
  path: string;
};

export type BrowserPackage = {
  type: PackageType.Browser;
  name: string;
  path: string;
};

export type Package = NodePackage | BrowserPackage;

// Warning: The order matters!
export const packages: Package[] = [
  {
    type: PackageType.Node,
    name: 'react-cosmos-shared2',
    path: 'packages/react-cosmos-shared2',
  },
  {
    type: PackageType.Node,
    name: 'react-cosmos-plugin',
    path: 'packages/react-cosmos-plugin',
  },
  {
    type: PackageType.Browser,
    name: 'react-cosmos-playground2',
    path: 'packages/react-cosmos-playground2',
  },
  {
    type: PackageType.Node,
    name: 'react-cosmos',
    path: 'packages/react-cosmos',
  },
  {
    type: PackageType.Browser,
    name: 'example-ui-plugin',
    path: 'example-ui-plugin',
  },
];

export function getFormattedPackageList(includedPackages: Package[]) {
  return ['', ...includedPackages.map(p => p.name)].join('\n - ');
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
