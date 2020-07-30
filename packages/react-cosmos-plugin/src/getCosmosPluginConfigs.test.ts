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
        "uiPath": "BuildNotifications/index.ts",
      },
      Object {
        "name": "Class state panel",
        "rootDir": "ClassStatePanel",
        "uiPath": "ClassStatePanel/index.tsx",
      },
      Object {
        "name": "Content overlay",
        "rootDir": "ContentOverlay",
        "uiPath": "ContentOverlay/index.tsx",
      },
      Object {
        "name": "Control panel",
        "rootDir": "ControlPanel",
        "uiPath": "ControlPanel/index.tsx",
      },
      Object {
        "name": "Core",
        "rootDir": "Core",
        "uiPath": "Core/index.tsx",
      },
      Object {
        "name": "Edit fixture button",
        "rootDir": "EditFixtureButton",
        "uiPath": "EditFixtureButton/index.tsx",
      },
      Object {
        "name": "Fixture bookmark",
        "rootDir": "FixtureBookmark",
        "uiPath": "FixtureBookmark/index.tsx",
      },
      Object {
        "name": "Fixture search",
        "rootDir": "FixtureSearch",
        "uiPath": "FixtureSearch/index.tsx",
      },
      Object {
        "name": "Fixture tree",
        "rootDir": "FixtureTree",
        "uiPath": "FixtureTree/index.tsx",
      },
      Object {
        "name": "Full screen button",
        "rootDir": "FullScreenButton",
        "uiPath": "FullScreenButton/index.tsx",
      },
      Object {
        "name": "Message handler",
        "rootDir": "MessageHandler",
        "uiPath": "MessageHandler/index.tsx",
      },
      Object {
        "name": "Notifications",
        "rootDir": "Notifications",
        "uiPath": "Notifications/index.tsx",
      },
      Object {
        "name": "Plugin list",
        "rootDir": "PluginList",
        "uiPath": "PluginList/index.tsx",
      },
      Object {
        "name": "Props panel",
        "rootDir": "PropsPanel",
        "uiPath": "PropsPanel/index.tsx",
      },
      Object {
        "name": "Remote renderer",
        "rootDir": "RemoteRenderer",
        "uiPath": "RemoteRenderer/index.tsx",
      },
      Object {
        "name": "Renderer core",
        "rootDir": "RendererCore",
        "uiPath": "RendererCore/index.ts",
      },
      Object {
        "name": "Renderer preview",
        "rootDir": "RendererPreview",
        "uiPath": "RendererPreview/index.tsx",
      },
      Object {
        "name": "Renderer select",
        "rootDir": "RendererSelect",
        "uiPath": "RendererSelect/index.tsx",
      },
      Object {
        "name": "Responsive preview",
        "rootDir": "ResponsivePreview",
        "uiPath": "ResponsivePreview/index.tsx",
      },
      Object {
        "name": "Root",
        "rootDir": "Root",
        "uiPath": "Root/index.tsx",
      },
      Object {
        "name": "Router",
        "rootDir": "Router",
        "uiPath": "Router/index.ts",
      },
      Object {
        "name": "Select control",
        "rootDir": "SelectControl",
        "uiPath": "SelectControl/index.tsx",
      },
      Object {
        "name": "Standard control",
        "rootDir": "StandardControl",
        "uiPath": "StandardControl/index.tsx",
      },
      Object {
        "name": "Storage",
        "rootDir": "Storage",
        "uiPath": "Storage/index.ts",
      },
      Object {
        "name": "Webpack HMR notification",
        "rootDir": "WebpackHmrNotification",
        "uiPath": "WebpackHmrNotification/index.ts",
      },
    ]
  `);
});
