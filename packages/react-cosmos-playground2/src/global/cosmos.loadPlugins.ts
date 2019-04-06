import { loadPlugins } from 'react-plugin';

// Statefulness alert!
import './registerPlugins';

loadPlugins({
  config: {
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__fixtures__',
      fixtureFileSuffix: 'fixture',
      devServerOn: false,
      webRendererUrl: '/_loader.html'
    }
  }
});
