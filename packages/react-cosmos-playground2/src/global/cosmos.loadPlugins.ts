import { loadPlugins } from 'react-plugin';
import { DEFAULT_PLUGIN_CONFIG } from '../shared/plugin';

// Statefulness alert!
import './registerPlugins';

loadPlugins({
  config: {
    ...DEFAULT_PLUGIN_CONFIG,
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture',
      devServerOn: false,
      webRendererUrl: '/_renderer.html'
    }
  }
});
