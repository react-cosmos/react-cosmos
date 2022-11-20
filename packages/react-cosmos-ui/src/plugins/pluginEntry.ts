import { enablePlugin } from 'react-plugin';
import './BuildNotifications';
import './ClassStatePanel';
import './ContentOverlay';
import './ControlPanel';
import './ControlSelect';
import './Core';
import './FixtureBookmark';
import './FixtureSearch';
import './FixtureTree';
import './FullScreenButton';
import './MessageHandler';
import './Notifications';
import './PluginList';
import './PropsPanel';
import './RemoteRenderer';
import './RendererCore';
import './RendererPreview';
import './RendererSelect';
import './ResponsivePreview';
import './Root';
import './Router';
import './StandardControl';
import './Storage';

const disabledPlugins = ['rendererSelect', 'pluginList'];

// Unregistering plugins first makes this file hot-reloadable because a plugin
// can only be registered once with a given name
// resetPlugins();

disabledPlugins.forEach(disabledPlugin => enablePlugin(disabledPlugin, false));
