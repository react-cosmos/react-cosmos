import { resetPlugins, enablePlugin } from 'react-plugin';

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

// TODO: Discover plugins in codebase automatically
require('../plugins/Storage').register();
require('../plugins/Core').register();
require('../plugins/MessageHandler').register();
require('../plugins/Notifications').register();
require('../plugins/Router').register();
require('../plugins/RendererCore').register();
require('../plugins/RendererHeader').register();
require('../plugins/RendererRemote').register();
require('../plugins/RendererPreview').register();
require('../plugins/Nav').register();
require('../plugins/ContentOverlay').register();
require('../plugins/ControlPanel').register();
require('../plugins/ResponsivePreview').register();
require('../plugins/EditFixtureButton').register();
require('../plugins/BuildNotifications').register();

// TODO: Read list of disabled plugins from user config
enablePlugin('controlPanel', false);
