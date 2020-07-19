import { loadPlugins } from 'react-plugin';
import { DEFAULT_PLUGIN_CONFIG } from '../shared/plugin';

import './plugins/pluginEntry';

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
