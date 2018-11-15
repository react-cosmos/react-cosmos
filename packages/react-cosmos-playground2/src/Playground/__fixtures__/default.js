// @flow

import { Playground } from '..';

// TEMP: This fixture is not useful at the moment because the Playground
// requires a renderer to communicate with. Maybe in the future we'll only
// create fixtures for bits of the Playground (nav, menus, etc).
export default {
  component: Playground,
  props: {
    options: {
      rendererPreviewUrl: 'mockRendererUrl',
      enableRemoteRenderers: false
    }
  }
};
