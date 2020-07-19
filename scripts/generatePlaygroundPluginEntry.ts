import { outputFile } from 'fs-extra';
import path from 'path';
import { getCosmosPluginConfigs } from 'react-cosmos';
import { done } from './shared';

const { stdout } = process;

(async () => {
  const packagesDir = path.join(
    __dirname,
    '../packages/react-cosmos-playground2/src/plugins'
  );

  const pluginConfigs = getCosmosPluginConfigs(packagesDir);

  const uiPluginPaths: string[] = [];
  pluginConfigs.forEach(pluginConfig => uiPluginPaths.push(...pluginConfig.ui));

  await outputFile(
    path.join(packagesDir, 'pluginEntry.ts'),
    getCompiledTemplate(uiPluginPaths),
    'utf8'
  );

  stdout.write(done(`Playground plugin entry generated.\n`));
})();

function getCompiledTemplate(pluginPaths: string[]) {
  return `// Run "yarn generate-playground-plugin-entry" to update this file. Do not change it by hand!
import { enablePlugin, resetPlugins } from 'react-plugin';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

${pluginPaths.map(getPluginRequire).join(`\n\n`)}

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));`;
}

function getPluginRequire(pluginPath: string) {
  return `delete require.cache[require.resolve('${pluginPath}')];
require('${pluginPath}');`;
}
