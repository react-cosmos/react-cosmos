// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, mockFile } from 'react-cosmos/jest.js';
import '../../testHelpers/mockEsmClientPath.js';
import '../../testHelpers/mockEsmLoaderPath.js';

import path from 'path';
import { createCosmosConfig } from 'react-cosmos/server.js';
import webpack from 'webpack';
import { getDevWebpackConfig } from '../getDevWebpackConfig.js';

async function getCustomDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
    const cosmosConfig = createCosmosConfig(process.cwd(), {
      webpack: {
        configPath: 'mywebpack.config.js',
      },
    });
    return getDevWebpackConfig(cosmosConfig, webpack);
  });
}

it('preserves React aliases', async () => {
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.react).toEqual('preact/compat');
    expect(resolve.alias['react-dom']).toEqual('preact/compat');
  } else {
    fail('Invalid resolve.alias');
  }
});

it('preserves React aliases with exact matches', async () => {
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        react$: 'preact/compat',
        'react-dom$': 'preact/compat',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.react$).toEqual('preact/compat');
    expect(resolve.alias.react).toBeUndefined();
    expect(resolve.alias['react-dom$']).toEqual('preact/compat');
    expect(resolve.alias['react-dom']).toBeUndefined();
  } else {
    fail('Invalid resolve.alias');
  }
});

it('preserves React aliases using array form', async () => {
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      alias: [
        { name: 'react', alias: 'preact/compat' },
        { name: 'react-dom$', alias: 'preact/compat' },
      ],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  if (resolve && Array.isArray(resolve.alias)) {
    expect(resolve.alias).toContainEqual({
      name: 'react',
      alias: 'preact/compat',
    });
    expect(resolve.alias).toContainEqual({
      name: 'react-dom$',
      alias: 'preact/compat',
    });
  } else {
    fail('Invalid resolve.alias');
  }
});

it('adds missing React aliases', async () => {
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        xyz: 'abc',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.xyz).toBe('abc');
    expect(resolve.alias.react).toMatch(
      new RegExp(`node_modules\\${path.sep}react$`)
    );
    expect(resolve.alias['react-dom']).toMatch(
      new RegExp(`node_modules\\${path.sep}react-dom$`)
    );
  } else {
    fail('Invalid resolve.alias');
  }
});

it('adds missing React aliases using array form', async () => {
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      alias: [{ name: 'xyz', alias: 'abc' }],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  if (resolve && Array.isArray(resolve.alias)) {
    expect(resolve.alias).toContainEqual({
      name: 'xyz',
      alias: 'abc',
    });
    expect(resolve.alias).toContainEqual({
      name: 'react',
      alias: expect.stringMatching(
        new RegExp(`node_modules\\${path.sep}react$`)
      ),
    });
    expect(resolve.alias).toContainEqual({
      name: 'react-dom',
      alias: expect.stringMatching(
        new RegExp(`node_modules\\${path.sep}react-dom$`)
      ),
    });
  } else {
    fail('Invalid resolve.alias');
  }
});
