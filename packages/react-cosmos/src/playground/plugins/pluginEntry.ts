// Run "yarn build react-cosmos-playground2" to update this file. Do not change it by hand!
import { enablePlugin, resetPlugins } from 'react-plugin';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

delete require.cache[require.resolve('./BuildNotifications/index.ts')];
require('./BuildNotifications/index.ts');

delete require.cache[require.resolve('./ClassStatePanel/index.tsx')];
require('./ClassStatePanel/index.tsx');

delete require.cache[require.resolve('./ContentOverlay/index.tsx')];
require('./ContentOverlay/index.tsx');

delete require.cache[require.resolve('./ControlPanel/index.tsx')];
require('./ControlPanel/index.tsx');

delete require.cache[require.resolve('./ControlSelect/index.tsx')];
require('./ControlSelect/index.tsx');

delete require.cache[require.resolve('./Core/index.tsx')];
require('./Core/index.tsx');

delete require.cache[require.resolve('./FixtureBookmark/index.tsx')];
require('./FixtureBookmark/index.tsx');

delete require.cache[require.resolve('./FixtureSearch/index.tsx')];
require('./FixtureSearch/index.tsx');

delete require.cache[require.resolve('./FixtureTree/index.tsx')];
require('./FixtureTree/index.tsx');

delete require.cache[require.resolve('./FullScreenButton/index.tsx')];
require('./FullScreenButton/index.tsx');

delete require.cache[require.resolve('./MessageHandler/index.tsx')];
require('./MessageHandler/index.tsx');

delete require.cache[require.resolve('./Notifications/index.tsx')];
require('./Notifications/index.tsx');

delete require.cache[require.resolve('./PluginList/index.tsx')];
require('./PluginList/index.tsx');

delete require.cache[require.resolve('./PropsPanel/index.tsx')];
require('./PropsPanel/index.tsx');

delete require.cache[require.resolve('./RemoteRenderer/index.tsx')];
require('./RemoteRenderer/index.tsx');

delete require.cache[require.resolve('./RendererCore/index.ts')];
require('./RendererCore/index.ts');

delete require.cache[require.resolve('./RendererPreview/index.tsx')];
require('./RendererPreview/index.tsx');

delete require.cache[require.resolve('./RendererSelect/index.tsx')];
require('./RendererSelect/index.tsx');

delete require.cache[require.resolve('./ResponsivePreview/index.tsx')];
require('./ResponsivePreview/index.tsx');

delete require.cache[require.resolve('./Root/index.tsx')];
require('./Root/index.tsx');

delete require.cache[require.resolve('./Router/index.ts')];
require('./Router/index.ts');

delete require.cache[require.resolve('./StandardControl/index.tsx')];
require('./StandardControl/index.tsx');

delete require.cache[require.resolve('./Storage/index.ts')];
require('./Storage/index.ts');

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));
