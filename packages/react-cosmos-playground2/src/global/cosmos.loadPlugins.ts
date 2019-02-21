import { loadPlugins } from 'react-plugin';

// Statefulness alert!
import './registerPlugins';

loadPlugins({
  config: {
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__jsxfixtures__',
      fixtureFileSuffix: 'jsxfixture'
    },
    rendererCore: {
      webUrl: '/_loader.html',
      enableRemote: false
    }
  }
});
