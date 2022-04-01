import { loadPlugins } from 'react-plugin';
import './plugins/pluginEntry.js';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig.js';

loadPlugins({
  config: {
    ...DEFAULT_PLUGIN_CONFIG,
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture',
      devServerOn: true,
      webRendererUrl: '/_renderer.html',
    },
  },
});
