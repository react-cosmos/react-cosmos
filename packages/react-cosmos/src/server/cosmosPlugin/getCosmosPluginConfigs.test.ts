import path from 'path';
import { getCosmosPluginConfigs } from './getCosmosPluginConfigs.js';

it('loads playground plugins', () => {
  const packagesDir = path.join(
    __dirname,
    '../../react-cosmos-playground2/src/plugins'
  );

  const configs = getCosmosPluginConfigs({ rootDir: packagesDir });
  expect(configs).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Build notifications",
        "rootDir": "BuildNotifications",
        "ui": "BuildNotifications/index.ts",
      },
      Object {
        "name": "Class state panel",
        "rootDir": "ClassStatePanel",
        "ui": "ClassStatePanel/index.tsx",
      },
      Object {
        "name": "Content overlay",
        "rootDir": "ContentOverlay",
        "ui": "ContentOverlay/index.tsx",
      },
      Object {
        "name": "Control panel",
        "rootDir": "ControlPanel",
        "ui": "ControlPanel/index.tsx",
      },
      Object {
        "name": "Select control",
        "rootDir": "ControlSelect",
        "ui": "ControlSelect/index.tsx",
      },
      Object {
        "name": "Core",
        "rootDir": "Core",
        "ui": "Core/index.tsx",
      },
      Object {
        "name": "Fixture bookmark",
        "rootDir": "FixtureBookmark",
        "ui": "FixtureBookmark/index.tsx",
      },
      Object {
        "name": "Fixture search",
        "rootDir": "FixtureSearch",
        "ui": "FixtureSearch/index.tsx",
      },
      Object {
        "name": "Fixture tree",
        "rootDir": "FixtureTree",
        "ui": "FixtureTree/index.tsx",
      },
      Object {
        "name": "Full screen button",
        "rootDir": "FullScreenButton",
        "ui": "FullScreenButton/index.tsx",
      },
      Object {
        "name": "Message handler",
        "rootDir": "MessageHandler",
        "ui": "MessageHandler/index.tsx",
      },
      Object {
        "name": "Notifications",
        "rootDir": "Notifications",
        "ui": "Notifications/index.tsx",
      },
      Object {
        "name": "Plugin list",
        "rootDir": "PluginList",
        "ui": "PluginList/index.tsx",
      },
      Object {
        "name": "Props panel",
        "rootDir": "PropsPanel",
        "ui": "PropsPanel/index.tsx",
      },
      Object {
        "name": "Remote renderer",
        "rootDir": "RemoteRenderer",
        "ui": "RemoteRenderer/index.tsx",
      },
      Object {
        "name": "Renderer core",
        "rootDir": "RendererCore",
        "ui": "RendererCore/index.ts",
      },
      Object {
        "name": "Renderer preview",
        "rootDir": "RendererPreview",
        "ui": "RendererPreview/index.tsx",
      },
      Object {
        "name": "Renderer select",
        "rootDir": "RendererSelect",
        "ui": "RendererSelect/index.tsx",
      },
      Object {
        "name": "Responsive preview",
        "rootDir": "ResponsivePreview",
        "ui": "ResponsivePreview/index.tsx",
      },
      Object {
        "name": "Root",
        "rootDir": "Root",
        "ui": "Root/index.tsx",
      },
      Object {
        "name": "Router",
        "rootDir": "Router",
        "ui": "Router/index.ts",
      },
      Object {
        "name": "Standard control",
        "rootDir": "StandardControl",
        "ui": "StandardControl/index.tsx",
      },
      Object {
        "name": "Storage",
        "rootDir": "Storage",
        "ui": "Storage/index.ts",
      },
      Object {
        "name": "Webpack HMR notification",
        "rootDir": "WebpackHmrNotification",
        "ui": "WebpackHmrNotification/index.ts",
      },
    ]
  `);
});
