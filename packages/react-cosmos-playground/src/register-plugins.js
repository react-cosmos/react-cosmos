// @flow

import { register } from 'react-plugin';

register(require('./plugins/ResponsivePreview').default);

// NOTE: Uncomment this to play with the experimental plugin-based UI
// register(require('./next/plugins/Preview').default);
// register(require('./next/plugins/Nav').default);
// register(require('./next/plugins/NavHeader').default);
// register(require('./next/plugins/FixtureEditor').default);
// register(require('./next/plugins/ResponsivePreview').default);
