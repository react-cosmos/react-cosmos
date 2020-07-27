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
        "ui": Array [
          "BuildNotifications/index.ts",
        ],
      },
      Object {
        "name": "Class state panel",
        "ui": Array [
          "ClassStatePanel/index.tsx",
        ],
      },
      Object {
        "name": "Content overlay",
        "ui": Array [
          "ContentOverlay/index.tsx",
        ],
      },
      Object {
        "name": "Control panel",
        "ui": Array [
          "ControlPanel/index.tsx",
        ],
      },
      Object {
        "name": "Core",
        "ui": Array [
          "Core/index.tsx",
        ],
      },
      Object {
        "name": "Edit fixture button",
        "ui": Array [
          "EditFixtureButton/index.tsx",
        ],
      },
      Object {
        "name": "Fixture bookmark",
        "ui": Array [
          "FixtureBookmark/index.tsx",
        ],
      },
      Object {
        "name": "Fixture search",
        "ui": Array [
          "FixtureSearch/index.tsx",
        ],
      },
      Object {
        "name": "Fixture tree",
        "ui": Array [
          "FixtureTree/index.tsx",
        ],
      },
      Object {
        "name": "Full screen button",
        "ui": Array [
          "FullScreenButton/index.tsx",
        ],
      },
      Object {
        "name": "Message handler",
        "ui": Array [
          "MessageHandler/index.tsx",
        ],
      },
      Object {
        "name": "Notifications",
        "ui": Array [
          "Notifications/index.tsx",
        ],
      },
      Object {
        "name": "Plugin list",
        "ui": Array [
          "PluginList/index.tsx",
        ],
      },
      Object {
        "name": "Props panel",
        "ui": Array [
          "PropsPanel/index.tsx",
        ],
      },
      Object {
        "name": "Remote renderer",
        "ui": Array [
          "RemoteRenderer/index.tsx",
        ],
      },
      Object {
        "name": "Renderer core",
        "ui": Array [
          "RendererCore/index.ts",
        ],
      },
      Object {
        "name": "Renderer preview",
        "ui": Array [
          "RendererPreview/index.tsx",
        ],
      },
      Object {
        "name": "Renderer select",
        "ui": Array [
          "RendererSelect/index.tsx",
        ],
      },
      Object {
        "name": "Responsive preview",
        "ui": Array [
          "ResponsivePreview/index.tsx",
        ],
      },
      Object {
        "name": "Root",
        "ui": Array [
          "Root/index.tsx",
        ],
      },
      Object {
        "name": "Router",
        "ui": Array [
          "Router/index.ts",
        ],
      },
      Object {
        "name": "Select control",
        "ui": Array [
          "SelectControl/index.tsx",
        ],
      },
      Object {
        "name": "Standard control",
        "ui": Array [
          "StandardControl/index.tsx",
        ],
      },
      Object {
        "name": "Storage",
        "ui": Array [
          "Storage/index.ts",
        ],
      },
      Object {
        "name": "Webpack HMR notification",
        "ui": Array [
          "WebpackHmrNotification/index.ts",
        ],
      },
    ]
  `);
});
