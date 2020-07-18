import { resetPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

// TODO: Discover plugins in codebase automatically
delete require.cache[require.resolve('../plugins/BuildNotifications')];
require('../plugins/BuildNotifications');
delete require.cache[require.resolve('../plugins/ClassStatePanel')];
require('../plugins/ClassStatePanel');
delete require.cache[require.resolve('../plugins/ContentOverlay')];
require('../plugins/ContentOverlay');
delete require.cache[require.resolve('../plugins/ControlPanel')];
require('../plugins/ControlPanel');
delete require.cache[require.resolve('../plugins/Core')];
require('../plugins/Core');
delete require.cache[require.resolve('../plugins/EditFixtureButton')];
require('../plugins/EditFixtureButton');
delete require.cache[require.resolve('../plugins/FixtureBookmark')];
require('../plugins/FixtureBookmark');
delete require.cache[require.resolve('../plugins/FixtureSearch')];
require('../plugins/FixtureSearch');
delete require.cache[require.resolve('../plugins/FixtureTree')];
require('../plugins/FixtureTree');
delete require.cache[require.resolve('../plugins/FullScreenButton')];
require('../plugins/FullScreenButton');
delete require.cache[require.resolve('../plugins/MessageHandler')];
require('../plugins/MessageHandler');
delete require.cache[require.resolve('../plugins/Notifications')];
require('../plugins/Notifications');
delete require.cache[require.resolve('../plugins/PluginList')];
require('../plugins/PluginList');
delete require.cache[require.resolve('../plugins/PropsPanel')];
require('../plugins/PropsPanel');
delete require.cache[require.resolve('../plugins/RemoteRenderer')];
require('../plugins/RemoteRenderer');
delete require.cache[require.resolve('../plugins/RendererCore')];
require('../plugins/RendererCore');
delete require.cache[require.resolve('../plugins/RendererPreview')];
require('../plugins/RendererPreview');
delete require.cache[require.resolve('../plugins/RendererSelect')];
require('../plugins/RendererSelect');
delete require.cache[require.resolve('../plugins/ResponsivePreview')];
require('../plugins/ResponsivePreview');
delete require.cache[require.resolve('../plugins/Root')];
require('../plugins/Root');
delete require.cache[require.resolve('../plugins/Router')];
require('../plugins/Router');
delete require.cache[require.resolve('../plugins/SelectControl')];
require('../plugins/SelectControl');
delete require.cache[require.resolve('../plugins/StandardControl')];
require('../plugins/StandardControl');
delete require.cache[require.resolve('../plugins/Storage')];
require('../plugins/Storage');
delete require.cache[require.resolve('../plugins/WebpackHmrNotification')];
require('../plugins/WebpackHmrNotification');

// TODO: Read list of disabled plugins from user config
enablePlugin('rendererSelect', false);
enablePlugin('pluginList', false);
