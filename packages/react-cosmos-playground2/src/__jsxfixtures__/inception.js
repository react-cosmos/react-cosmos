// @flow

import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';

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

export default <Slot name="root" />;
