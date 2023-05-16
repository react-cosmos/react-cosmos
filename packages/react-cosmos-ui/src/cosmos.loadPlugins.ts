import { loadPlugins } from 'react-plugin';
import { PlaygroundConfig } from './playgroundConfig.js';
import './plugins/pluginEntry.js';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig.js';

const rendererConfig: PlaygroundConfig = {
  ...DEFAULT_PLUGIN_CONFIG,
  core: {
    projectId: 'testProjectId',
    fixturesDir: '__fixtures__',
    fixtureFileSuffix: 'fixture',
    devServerOn: true,
  },
  rendererCore: {
    fixtures: {},
    rendererUrl: '/renderer.html',
  },
};

// This file is required to run globally with side effects for the "inception"
// fixture to work.
loadPlugins({
  config: rendererConfig,
});
