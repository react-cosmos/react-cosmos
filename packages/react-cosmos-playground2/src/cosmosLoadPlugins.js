// @flow

import { loadPlugins } from 'react-plugin';

// Statefulness alert!
import './register-plugins';

loadPlugins({
  config: {
    core: {
      projectId: 'testProjectId',
      fixturesDir: '__jsxfixtures__'
    },
    renderer: {
      webUrl: '/_loader.html',
      enableRemote: false
    }
  }
});
