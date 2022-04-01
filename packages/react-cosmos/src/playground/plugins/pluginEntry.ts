// Run "yarn build react-cosmos" to update this file. Do not change it by hand!
import { enablePlugin, resetPlugins } from 'react-plugin';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

delete require.cache[require.resolve('./BuildNotifications')];
require('./BuildNotifications');

delete require.cache[require.resolve('./ClassStatePanel')];
require('./ClassStatePanel');

delete require.cache[require.resolve('./ContentOverlay')];
require('./ContentOverlay');

delete require.cache[require.resolve('./ControlPanel')];
require('./ControlPanel');

delete require.cache[require.resolve('./ControlSelect')];
require('./ControlSelect');

delete require.cache[require.resolve('./Core')];
require('./Core');

delete require.cache[require.resolve('./FixtureBookmark')];
require('./FixtureBookmark');

delete require.cache[require.resolve('./FixtureSearch')];
require('./FixtureSearch');

delete require.cache[require.resolve('./FixtureTree')];
require('./FixtureTree');

delete require.cache[require.resolve('./FullScreenButton')];
require('./FullScreenButton');

delete require.cache[require.resolve('./MessageHandler')];
require('./MessageHandler');

delete require.cache[require.resolve('./Notifications')];
require('./Notifications');

delete require.cache[require.resolve('./PluginList')];
require('./PluginList');

delete require.cache[require.resolve('./PropsPanel')];
require('./PropsPanel');

delete require.cache[require.resolve('./RemoteRenderer')];
require('./RemoteRenderer');

delete require.cache[require.resolve('./RendererCore')];
require('./RendererCore');

delete require.cache[require.resolve('./RendererPreview')];
require('./RendererPreview');

delete require.cache[require.resolve('./RendererSelect')];
require('./RendererSelect');

delete require.cache[require.resolve('./ResponsivePreview')];
require('./ResponsivePreview');

delete require.cache[require.resolve('./Root')];
require('./Root');

delete require.cache[require.resolve('./Router')];
require('./Router');

delete require.cache[require.resolve('./StandardControl')];
require('./StandardControl');

delete require.cache[require.resolve('./Storage')];
require('./Storage');

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));
