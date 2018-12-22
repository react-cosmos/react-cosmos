// @flow

import { enablePlugin } from 'react-plugin';

// TODO: Discover plugins in codebase automatically
require('./plugins/Storage').register();
require('./plugins/Core').register();
require('./plugins/Renderer').register();
require('./plugins/RendererPreview').register();
require('./plugins/RendererRemote').register();
require('./plugins/Router').register();
require('./plugins/Nav').register();
require('./plugins/FixtureHeader').register();
const ctrlPanelId = require('./plugins/ControlPanel').register();
require('./plugins/ResponsivePreview').register();

// TODO: Read list of disabled plugins from user config
// QUESTION: How to identify controlPanel plugin if plugin name isn't unique?
// Maybe have both pluginName (unique globally) and pluginKey (unique in loaded
// scope) for plugins. Eg. { name: 'control-panel', key: 'ctlrPanel' }. And
// maybe key can be optional and derived from name when missing.
enablePlugin(ctrlPanelId, false);
