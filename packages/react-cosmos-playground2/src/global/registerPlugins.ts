import { resetPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

// TODO: Discover plugins in codebase automatically
require('../plugins/BuildNotifications').register();
require('../plugins/ClassStatePanel').register();
require('../plugins/ContentOverlay').register();
require('../plugins/ControlPanel').register();
require('../plugins/Core').register();
require('../plugins/EditFixtureButton').register();
require('../plugins/FixtureSearch').register();
require('../plugins/FixtureTree').register();
require('../plugins/FullScreenButton').register();
require('../plugins/Layout').register();
require('../plugins/MessageHandler').register();
require('../plugins/Nav').register();
require('../plugins/Notifications').register();
require('../plugins/PluginList').register();
require('../plugins/PropsPanel').register();
require('../plugins/RendererCore').register();
require('../plugins/RendererHeader').register();
require('../plugins/RendererPreview').register();
require('../plugins/RendererRemote').register();
require('../plugins/RendererSelect').register();
require('../plugins/ResponsivePreview').register();
require('../plugins/Router').register();
require('../plugins/Storage').register();
require('../plugins/WebpackHmrNotification').register();

// TODO: Read list of disabled plugins from user config
enablePlugin('rendererSelect', false);
enablePlugin('pluginList', false);
