import path from 'path';
import { vi } from 'vitest';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';

// Allow plugin configs to be read without having to actually build
// the plugin packages
vi.mock('../utils/resolveSilent.js', () => {
  return {
    resolveSilent: (moduleId: string) =>
      moduleId.endsWith('.js') ? moduleId : `${moduleId}.js`,
  };
});

it('loads mono repo plugins', async () => {
  const packagesDir = path.join(__dirname, '../../..');

  const configs = await findCosmosPluginConfigs({
    rootDir: packagesDir,
    relativePaths: true,
  });
  expect(configs).toContainEqual({
    name: 'Boolean input',
    rootDir: 'react-cosmos-plugin-boolean-input',
    ui: path.join('react-cosmos-plugin-boolean-input', 'dist', 'ui.js'),
  });
  expect(configs).toContainEqual({
    name: 'Open fixture',
    rootDir: 'react-cosmos-plugin-open-fixture',
    ui: path.join('react-cosmos-plugin-open-fixture', 'dist', 'ui.js'),
  });
  expect(configs).toContainEqual({
    name: 'Vite',
    rootDir: 'react-cosmos-plugin-vite',
    server: path.join(
      'react-cosmos-plugin-vite',
      'dist',
      'viteServerPlugin.js'
    ),
  });
  expect(configs).toContainEqual({
    name: 'Webpack',
    rootDir: 'react-cosmos-plugin-webpack',
    ui: path.join('react-cosmos-plugin-webpack', 'dist', 'ui', 'build.js'),
    server: path.join(
      'react-cosmos-plugin-webpack',
      'dist',
      'server',
      'webpackServerPlugin.js'
    ),
  });
});
