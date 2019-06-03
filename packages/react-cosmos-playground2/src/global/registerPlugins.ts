import { resetPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

// TODO: Discover plugins in codebase automatically
// TODO: Sort alphabetically after SlotArray supports user sorting
require('../plugins/Storage').register();
require('../plugins/Core').register();
require('../plugins/MessageHandler').register();
require('../plugins/Router').register();
require('../plugins/Notifications').register();
require('../plugins/RendererCore').register();
require('../plugins/Layout').register();
require('../plugins/RendererHeader').register();
require('../plugins/RendererPreview').register();
require('../plugins/Nav').register();
require('../plugins/ContentOverlay').register();
require('../plugins/EditFixtureButton').register();
require('../plugins/RendererRemote').register();
require('../plugins/FullScreenButton').register();
require('../plugins/ResponsivePreview').register();
require('../plugins/ControlPanel').register();
require('../plugins/PropsPanel').register();
require('../plugins/ClassStatePanel').register();
require('../plugins/RendererSelect').register();
require('../plugins/PluginList').register();
require('../plugins/BuildNotifications').register();
require('../plugins/WebpackHmrNotification').register();

// TODO: Read list of disabled plugins from user config
enablePlugin('controlPanel', false);
enablePlugin('propsPanel', false);
enablePlugin('classStatePanel', false);
enablePlugin('rendererSelect', false);
enablePlugin('pluginList', false);
