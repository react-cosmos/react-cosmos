// @flow

import { enablePlugin } from 'react-plugin';

// TODO: Discover plugins in codebase automatically
require('./plugins/Storage').register();
require('./plugins/Core').register();
require('./plugins/Renderer').register();
require('./plugins/RendererPreview').register();
require('./plugins/RendererPreviewOverlay').register();
require('./plugins/RendererRemote').register();
require('./plugins/Router').register();
require('./plugins/Nav').register();
require('./plugins/FixtureHeader').register();
require('./plugins/ControlPanel').register();
require('./plugins/ResponsivePreview').register();

// TODO: Read list of disabled plugins from user config
enablePlugin('controlPanel', false);
