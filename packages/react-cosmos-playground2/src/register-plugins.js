// @flow

import { unregisterPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
unregisterPlugins();

// TODO: Discover plugins in codebase automatically
require('./plugins/Storage').register();
require('./plugins/Core').register();
require('./plugins/Renderer').register();
require('./plugins/RendererHeader').register();
require('./plugins/RendererRemote').register();
require('./plugins/RendererPreview').register();
require('./plugins/RendererPreviewOverlay').register();
require('./plugins/Router').register();
require('./plugins/Nav').register();
require('./plugins/ControlPanel').register();
require('./plugins/ResponsivePreview').register();

// TODO: Read list of disabled plugins from user config
enablePlugin('controlPanel', false);
