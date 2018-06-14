/**
 * @flow
 * @jest-environment node
 */

import { hasUserCosmosConfig, generateCosmosConfig } from 'react-cosmos-config';
import { startServer } from '../../start';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: jest.fn(() => false),
  generateCosmosConfig: jest.fn(),
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    port: 9999,
    hostname: '127.0.0.1',
    hot: true,
    watchDirs: ['.'],
    globalImports: [],
    // Deprecated options needed for backwards compatibility
    componentPaths: []
  })
}));

let stopServer;

// Server tests share a single beforeAll case to minimize webpack compilation
beforeAll(async () => {
  jest.clearAllMocks();
  stopServer = await startServer();
});

afterAll(async () => {
  await stopServer();
});

it('checks if user has cosmos config', () => {
  expect(hasUserCosmosConfig).toHaveBeenCalled();
});

it('calls config generation function', () => {
  expect(generateCosmosConfig).toHaveBeenCalled();
});
