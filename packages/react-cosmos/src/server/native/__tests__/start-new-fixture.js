/**
 * @flow
 * @jest-environment node
 */

import { join } from 'path';
import { readFile, copy, remove } from 'fs-extra';
import until from 'async-until';
import {
  defaultFileMatch as mockFileMatch,
  defaultFileMatchIgnore as mockFileMatchIgnore,
  defaultExclude as mockExclude
} from 'react-cosmos-shared/server';
import { startServer } from '../start';

const mockRootPath = join(__dirname, '__fsmocks__');
const mockProxiesPath = join(mockRootPath, 'cosmos.proxies');
const mockNewFixturePath = join(mockRootPath, 'jestnowatch.fixture.js');
const mockModulesPath = join(__dirname, '__fsoutput__/cosmos.modules.js');

jest.mock('react-cosmos-config', () => ({
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    port: 10002,
    hostname: null,
    publicUrl: '/',
    fileMatch: mockFileMatch,
    fileMatchIgnore: mockFileMatchIgnore,
    exclude: mockExclude,
    proxiesPath: mockProxiesPath,
    modulesPath: mockModulesPath
  })
}));

let stopServer;

beforeEach(async () => {
  jest.clearAllMocks();
  stopServer = await startServer();
});

afterEach(async () => {
  await stopServer();
  await remove(mockModulesPath);
  await remove(mockNewFixturePath);
});

it('re-generates modules file on new fixture file ', async () => {
  expect((await getFixtureFilesFromModules()).length).toBe(1);

  await copy(join(mockRootPath, 'MyComponent.fixture.js'), mockNewFixturePath);

  // Wait for fs event to be picked up
  await until(async () => (await getFixtureFilesFromModules()).length === 2, {
    loopDelay: 200,
    timeout: 2000,
    failMsg: 'cosmos.modules file has not been updated'
  });
});

async function getFixtureFilesFromModules() {
  const output = await readFile(mockModulesPath, 'utf8');

  return JSON.parse(output.match(/fixtureFiles: (.+?),\n/)[1]);
}
