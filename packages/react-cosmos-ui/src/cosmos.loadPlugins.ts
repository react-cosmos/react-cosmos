import { loadPlugins } from 'react-plugin';
import './plugins/pluginEntry.js';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig.js';

// This file is required to run globally with side effects for the "inception"
// fixture to work.
loadPlugins({
  config: {
    ...DEFAULT_PLUGIN_CONFIG,
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture',
      devServerOn: true,
      rendererUrl: '/_renderer.html',
    },
  },
});
