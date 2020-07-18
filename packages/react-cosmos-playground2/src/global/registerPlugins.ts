import { resetPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

// TODO: Discover plugins in codebase automatically
require('../plugins/BuildNotifications');
require('../plugins/ClassStatePanel');
require('../plugins/ContentOverlay');
require('../plugins/ControlPanel');
require('../plugins/Core');
require('../plugins/EditFixtureButton');
require('../plugins/FixtureBookmark');
require('../plugins/FixtureSearch');
require('../plugins/FixtureTree');
require('../plugins/FullScreenButton');
require('../plugins/MessageHandler');
require('../plugins/Notifications');
require('../plugins/PluginList');
require('../plugins/PropsPanel');
require('../plugins/RemoteRenderer');
require('../plugins/RendererCore');
require('../plugins/RendererPreview');
require('../plugins/RendererSelect');
require('../plugins/ResponsivePreview');
require('../plugins/Root');
require('../plugins/Router');
require('../plugins/SelectControl');
require('../plugins/StandardControl');
require('../plugins/Storage');
require('../plugins/WebpackHmrNotification');

// TODO: Read list of disabled plugins from user config
enablePlugin('rendererSelect', false);
enablePlugin('pluginList', false);
