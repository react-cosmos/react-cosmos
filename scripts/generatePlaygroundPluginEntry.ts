import { outputFile } from 'fs-extra';
import path from 'path';
import { getCosmosPluginConfigs } from 'react-cosmos/src/server';
import { done } from './shared';

const { stdout } = process;

export async function generatePlaygroundPluginEntry() {
  const rootDir = path.join(
    __dirname,
    '../packages/react-cosmos/src/playground/plugins'
  );

  const configs = getCosmosPluginConfigs({ rootDir });
  const uiPaths: string[] = [];
  configs.forEach(config => {
    if (config.ui) uiPaths.push(`./${config.ui.replace(/\/index\.tsx?$/, '')}`);
  });

  const entryPath = path.join(rootDir, 'pluginEntry.ts');
  await outputFile(entryPath, createPluginsEntry(uiPaths), 'utf8');

  stdout.write(done(`Playground plugin entry generated.\n`));
}

function createPluginsEntry(paths: string[]) {
  return `// Run "yarn build react-cosmos" to update this file. Do not change it by hand!
import { enablePlugin, resetPlugins } from 'react-plugin';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

${paths.map(getHotReloadablePluginRequire).join(`\n\n`)}

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));\n`;
}

function getHotReloadablePluginRequire(pluginPath: string) {
  return `delete require.cache[require.resolve('${pluginPath}')];
require('${pluginPath}');`;
}
