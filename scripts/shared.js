// @flow

import { readFile, writeFile } from 'fs';
import path from 'path';
import glob from 'glob';
import rimraf from 'rimraf';
import { argv } from 'yargs';
import chalk from 'chalk';

type PackageNames = string[];

export const globAsync = asyncify(glob);
export const readFileAsync = asyncify(readFile);
export const writeFileAsync = asyncify(writeFile);
export const rimrafAsync = asyncify(rimraf);

export const AS_IS_PACKAGES = ['react-cosmos-flow'];
export const TS_PACKAGES = ['react-cosmos-shared2', 'react-cosmos-fixture'];
export const BROWSER_PACKAGES = [
  'react-cosmos-playground',
  'react-cosmos-playground2'
];

export async function getNodePackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();
  const exclude = [...AS_IS_PACKAGES, ...TS_PACKAGES, ...BROWSER_PACKAGES];

  return allPackages.filter(p => exclude.indexOf(p) === -1);
}

export async function getTsPackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();

  return allPackages.filter(p => TS_PACKAGES.indexOf(p) !== -1);
}

export async function getBrowserPackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();

  return allPackages.filter(p => BROWSER_PACKAGES.indexOf(p) !== -1);
}

export async function getAllPackages(): Promise<PackageNames> {
  const files = await globAsync('./packages/react-*');

  return files.map(f => path.basename(f));
}

export async function getExamples(): Promise<PackageNames> {
  const files = await globAsync('./examples/*/');

  return files.map(f => path.basename(f));
}

export function getFormattedPackageList(pkgNames: PackageNames) {
  return ['', ...pkgNames].join('\n - ');
}

export function getUnnamedArg(index: number = 0): void | number | string {
  return argv._[index];
}

export function getNamedArg(
  name: string
): void | null | boolean | number | string {
  return argv[name];
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

function asyncify(fn: Function) {
  return (...args: Array<*>): Promise<*> => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}
