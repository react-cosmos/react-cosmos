// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, mockCwdModuleDefault } from 'react-cosmos/vitest.js';

import path from 'path';
import { createCosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { getDevWebpackConfig } from '../getDevWebpackConfig.js';

async function getCustomDevWebpackConfig(expectAliasLog: boolean) {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using Webpack config found at mywebpack.config.js');
    expectLog(
      '[Cosmos] Learn how to override Webpack config for Cosmos: https://reactcosmos.org/docs/getting-started/webpack#webpack-config-override'
    );
    if (expectAliasLog) {
      expectLog('[Cosmos] React and React DOM aliases found in Webpack config');
    }
    const config = createCosmosConfig(process.cwd(), {
      webpack: {
        configPath: 'mywebpack.config.js',
      },
    });
    return getDevWebpackConfig(config, webpack);
  });
}

it('preserves React aliases', async () => {
  await mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig(true);
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.react).toEqual('preact/compat');
    expect(resolve.alias['react-dom']).toEqual('preact/compat');
  } else {
    throw new Error('Invalid resolve.alias');
  }
});

it('preserves React aliases with exact matches', async () => {
  await mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        react$: 'preact/compat',
        'react-dom$': 'preact/compat',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig(true);
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.react$).toEqual('preact/compat');
    expect(resolve.alias.react).toBeUndefined();
    expect(resolve.alias['react-dom$']).toEqual('preact/compat');
    expect(resolve.alias['react-dom']).toBeUndefined();
  } else {
    throw new Error('Invalid resolve.alias');
  }
});

it('preserves React aliases using array form', async () => {
  await mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      alias: [
        { name: 'react', alias: 'preact/compat' },
        { name: 'react-dom$', alias: 'preact/compat' },
      ],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig(true);
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
    throw new Error('Invalid resolve.alias');
  }
});

it('adds missing React aliases', async () => {
  await mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      alias: {
        xyz: 'abc',
      },
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig(false);
  if (resolve && resolve.alias && !Array.isArray(resolve.alias)) {
    expect(resolve.alias.xyz).toBe('abc');
    expect(resolve.alias.react).toMatch(
      new RegExp(`node_modules\\${path.sep}react$`)
    );
    expect(resolve.alias['react-dom']).toMatch(
      new RegExp(`node_modules\\${path.sep}react-dom$`)
    );
  } else {
    throw new Error('Invalid resolve.alias');
  }
});

it('adds missing React aliases using array form', async () => {
  await mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      alias: [{ name: 'xyz', alias: 'abc' }],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig(false);
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
    throw new Error('Invalid resolve.alias');
  }
});
