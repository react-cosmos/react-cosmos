import path from 'path';
import { getCosmosPluginConfigs } from './getCosmosPluginConfigs';

it('loads playground plugins', () => {
  const packagesDir = path.join(
    __dirname,
    '../../react-cosmos-playground2/src/plugins'
  );

  const configs = getCosmosPluginConfigs(packagesDir);
  expect(configs).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Build notifications",
        "rootDir": "BuildNotifications",
        "uiPath": "BuildNotifications/ui.js",
      },
      Object {
        "name": "Class state panel",
        "rootDir": "ClassStatePanel",
        "uiPath": "ClassStatePanel/ui.js",
      },
      Object {
        "name": "Content overlay",
        "rootDir": "ContentOverlay",
        "uiPath": "ContentOverlay/ui.js",
      },
      Object {
        "name": "Control panel",
        "rootDir": "ControlPanel",
        "uiPath": "ControlPanel/ui.js",
      },
      Object {
        "name": "Core",
        "rootDir": "Core",
        "uiPath": "Core/ui.js",
      },
      Object {
        "name": "Edit fixture button",
        "rootDir": "EditFixtureButton",
        "uiPath": "EditFixtureButton/ui.js",
      },
      Object {
        "name": "Fixture bookmark",
        "rootDir": "FixtureBookmark",
        "uiPath": "FixtureBookmark/ui.js",
      },
      Object {
        "name": "Fixture search",
        "rootDir": "FixtureSearch",
        "uiPath": "FixtureSearch/ui.js",
      },
      Object {
        "name": "Fixture tree",
        "rootDir": "FixtureTree",
        "uiPath": "FixtureTree/ui.js",
      },
      Object {
        "name": "Full screen button",
        "rootDir": "FullScreenButton",
        "uiPath": "FullScreenButton/ui.js",
      },
      Object {
        "name": "Message handler",
        "rootDir": "MessageHandler",
        "uiPath": "MessageHandler/ui.js",
      },
      Object {
        "name": "Notifications",
        "rootDir": "Notifications",
        "uiPath": "Notifications/ui.js",
      },
      Object {
        "name": "Plugin list",
        "rootDir": "PluginList",
        "uiPath": "PluginList/ui.js",
      },
      Object {
        "name": "Props panel",
        "rootDir": "PropsPanel",
        "uiPath": "PropsPanel/ui.js",
      },
      Object {
        "name": "Remote renderer",
        "rootDir": "RemoteRenderer",
        "uiPath": "RemoteRenderer/ui.js",
      },
      Object {
        "name": "Renderer core",
        "rootDir": "RendererCore",
        "uiPath": "RendererCore/ui.js",
      },
      Object {
        "name": "Renderer preview",
        "rootDir": "RendererPreview",
        "uiPath": "RendererPreview/ui.js",
      },
      Object {
        "name": "Renderer select",
        "rootDir": "RendererSelect",
        "uiPath": "RendererSelect/ui.js",
      },
      Object {
        "name": "Responsive preview",
        "rootDir": "ResponsivePreview",
        "uiPath": "ResponsivePreview/ui.js",
      },
      Object {
        "name": "Root",
        "rootDir": "Root",
        "uiPath": "Root/ui.js",
      },
      Object {
        "name": "Router",
        "rootDir": "Router",
        "uiPath": "Router/ui.js",
      },
      Object {
        "name": "Select control",
        "rootDir": "SelectControl",
        "uiPath": "SelectControl/ui.js",
      },
      Object {
        "name": "Standard control",
        "rootDir": "StandardControl",
        "uiPath": "StandardControl/ui.js",
      },
      Object {
        "name": "Storage",
        "rootDir": "Storage",
        "uiPath": "Storage/ui.js",
      },
      Object {
        "name": "Webpack HMR notification",
        "rootDir": "WebpackHmrNotification",
        "uiPath": "WebpackHmrNotification/ui.js",
      },
    ]
  `);
});
