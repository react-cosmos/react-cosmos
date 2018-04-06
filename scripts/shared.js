// @flow

import { readFile, writeFile } from 'fs';
import path from 'path';
import glob from 'glob';
import { argv } from 'yargs';
import chalk from 'chalk';

type PackageNames = Array<string>;

export const globAsync = asyncify(glob);
export const readFileAsync = asyncify(readFile);
export const writeFileAsync = asyncify(writeFile);

const AS_IS_PACKAGES = ['react-cosmos-flow'];
const BROWSER_PACKAGES = ['react-cosmos-playground'];

export async function getNodePackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();
  const exclude = [...AS_IS_PACKAGES, ...BROWSER_PACKAGES];

  return allPackages.filter(p => exclude.indexOf(p) === -1);
}

export async function getBrowserPackages(): Promise<PackageNames> {
  const allPackages = await getAllPackages();

  return allPackages.filter(p => BROWSER_PACKAGES.indexOf(p) !== -1);
}

export async function getAllPackages(): Promise<PackageNames> {
  const files = await globAsync('./packages/react-*');

  return files.map(f => path.basename(f));
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

export function successText(text: string) {
  return chalk.bold.inverse.green(text);
}

export function errorText(text: string) {
  return chalk.bold.inverse.red(text);
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
