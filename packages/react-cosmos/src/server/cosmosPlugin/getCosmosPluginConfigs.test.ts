import path from 'path';
import { getCosmosPluginConfigs } from './getCosmosPluginConfigs.js';

it('loads playground plugins', () => {
  const packagesDir = path.join(__dirname, '../../playground/plugins');

  const configs = getCosmosPluginConfigs({ rootDir: packagesDir });
  expect(configs).toMatchInlineSnapshot(`
    [
      {
        "name": "Build notifications",
        "rootDir": "BuildNotifications",
        "ui": "BuildNotifications/index.ts",
      },
      {
        "name": "Class state panel",
        "rootDir": "ClassStatePanel",
        "ui": "ClassStatePanel/index.tsx",
      },
      {
        "name": "Content overlay",
        "rootDir": "ContentOverlay",
        "ui": "ContentOverlay/index.tsx",
      },
      {
        "name": "Control panel",
        "rootDir": "ControlPanel",
        "ui": "ControlPanel/index.tsx",
      },
      {
        "name": "Select control",
        "rootDir": "ControlSelect",
        "ui": "ControlSelect/index.tsx",
      },
      {
        "name": "Core",
        "rootDir": "Core",
        "ui": "Core/index.tsx",
      },
      {
        "name": "Fixture bookmark",
        "rootDir": "FixtureBookmark",
        "ui": "FixtureBookmark/index.tsx",
      },
      {
        "name": "Fixture search",
        "rootDir": "FixtureSearch",
        "ui": "FixtureSearch/index.tsx",
      },
      {
        "name": "Fixture tree",
        "rootDir": "FixtureTree",
        "ui": "FixtureTree/index.tsx",
      },
      {
        "name": "Full screen button",
        "rootDir": "FullScreenButton",
        "ui": "FullScreenButton/index.tsx",
      },
      {
        "name": "Message handler",
        "rootDir": "MessageHandler",
        "ui": "MessageHandler/index.tsx",
      },
      {
        "name": "Notifications",
        "rootDir": "Notifications",
        "ui": "Notifications/index.tsx",
      },
      {
        "name": "Plugin list",
        "rootDir": "PluginList",
        "ui": "PluginList/index.tsx",
      },
      {
        "name": "Props panel",
        "rootDir": "PropsPanel",
        "ui": "PropsPanel/index.tsx",
      },
      {
        "name": "Remote renderer",
        "rootDir": "RemoteRenderer",
        "ui": "RemoteRenderer/index.tsx",
      },
      {
        "name": "Renderer core",
        "rootDir": "RendererCore",
        "ui": "RendererCore/index.ts",
      },
      {
        "name": "Renderer preview",
        "rootDir": "RendererPreview",
        "ui": "RendererPreview/index.tsx",
      },
      {
        "name": "Renderer select",
        "rootDir": "RendererSelect",
        "ui": "RendererSelect/index.tsx",
      },
      {
        "name": "Responsive preview",
        "rootDir": "ResponsivePreview",
        "ui": "ResponsivePreview/index.tsx",
      },
      {
        "name": "Root",
        "rootDir": "Root",
        "ui": "Root/index.tsx",
      },
      {
        "name": "Router",
        "rootDir": "Router",
        "ui": "Router/index.ts",
      },
      {
        "name": "Standard control",
        "rootDir": "StandardControl",
        "ui": "StandardControl/index.tsx",
      },
      {
        "name": "Storage",
        "rootDir": "Storage",
        "ui": "Storage/index.ts",
      },
    ]
  `);
});
