import { readFile, writeFile } from 'fs';
import * as path from 'path';
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

export const SHARED_PACKAGE = 'react-cosmos-shared2';
export const NODE_PACKAGES = ['react-cosmos-fixture', 'react-cosmos'];
export const BROWSER_PACKAGES = ['react-cosmos-playground2'];

export async function getNodePackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();
  return allPackages.filter(p => NODE_PACKAGES.indexOf(p) !== -1);
}

export async function getBrowserPackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();
  return allPackages.filter(p => BROWSER_PACKAGES.indexOf(p) !== -1);
}

// TODO: Remove and simplify
export async function getAllPackages(): Promise<PackageNames> {
  const files: string[] = await globAsync('./packages/react-*');
  return files.map(f => path.basename(f));
}

export async function getExamples(): Promise<PackageNames> {
  const files: string[] = await globAsync('./examples/*/');
  return files.map(f => path.basename(f));
}

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
