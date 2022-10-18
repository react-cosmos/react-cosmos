import { loadPlugins } from 'react-plugin';
import './plugins/pluginEntry';
import { DEFAULT_PLUGIN_CONFIG } from './shared/defaultPluginConfig';

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
