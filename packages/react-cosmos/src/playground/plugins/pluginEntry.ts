import { enablePlugin, resetPlugins } from 'react-plugin';
import './BuildNotifications/index.js';
import './ClassStatePanel/index.js';
import './ContentOverlay/index.js';
import './ControlPanel/index.js';
import './ControlSelect/index.js';
import './Core/index.js';
import './FixtureBookmark/index.js';
import './FixtureSearch/index.js';
import './FixtureTree/index.js';
import './FullScreenButton/index.js';
import './MessageHandler/index.js';
import './Notifications/index.js';
import './PluginList/index.js';
import './PropsPanel/index.js';
import './RemoteRenderer/index.js';
import './RendererCore/index.js';
import './RendererPreview/index.js';
import './RendererSelect/index.js';
import './ResponsivePreview/index.js';
import './Root/index.js';
import './Router/index.js';
import './StandardControl/index.js';
import './Storage/index.js';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
resetPlugins();

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));
