import path from 'path';
import { getCosmosPluginConfigs } from './getCosmosPluginConfigs';

it('loads playground plugins', () => {
  const packagesDir = path.join(
    __dirname,
    '../../../react-cosmos-playground2/src/plugins'
  );

  const configs = getCosmosPluginConfigs(packagesDir);
  const normalizedConfigs = configs.map(plugin => ({
    ...plugin,
    ui: plugin.ui.map(uiPath => uiPath.replace(/^.+\/src/, '')),
  }));

  expect(normalizedConfigs).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Build notifications",
        "ui": Array [
          "/plugins/BuildNotifications/index.ts",
        ],
      },
      Object {
        "name": "Class state panel",
        "ui": Array [
          "/plugins/ClassStatePanel/index.tsx",
        ],
      },
      Object {
        "name": "Content overlay",
        "ui": Array [
          "/plugins/ContentOverlay/index.tsx",
        ],
      },
      Object {
        "name": "Control panel",
        "ui": Array [
          "/plugins/ControlPanel/index.tsx",
        ],
      },
      Object {
        "name": "Core",
        "ui": Array [
          "/plugins/Core/index.tsx",
        ],
      },
      Object {
        "name": "Edit fixture button",
        "ui": Array [
          "/plugins/EditFixtureButton/index.tsx",
        ],
      },
      Object {
        "name": "Fixture bookmark",
        "ui": Array [
          "/plugins/FixtureBookmark/index.tsx",
        ],
      },
      Object {
        "name": "Fixture search",
        "ui": Array [
          "/plugins/FixtureSearch/index.tsx",
        ],
      },
      Object {
        "name": "Fixture tree",
        "ui": Array [
          "/plugins/FixtureTree/index.tsx",
        ],
      },
      Object {
        "name": "Full screen button",
        "ui": Array [
          "/plugins/FullScreenButton/index.tsx",
        ],
      },
      Object {
        "name": "Message handler",
        "ui": Array [
          "/plugins/MessageHandler/index.tsx",
        ],
      },
      Object {
        "name": "Notifications",
        "ui": Array [
          "/plugins/Notifications/index.tsx",
        ],
      },
      Object {
        "name": "Plugin list",
        "ui": Array [
          "/plugins/PluginList/index.tsx",
        ],
      },
      Object {
        "name": "Props panel",
        "ui": Array [
          "/plugins/PropsPanel/index.tsx",
        ],
      },
      Object {
        "name": "Remote renderer",
        "ui": Array [
          "/plugins/RemoteRenderer/index.tsx",
        ],
      },
      Object {
        "name": "Renderer core",
        "ui": Array [
          "/plugins/RendererCore/index.ts",
        ],
      },
      Object {
        "name": "Renderer preview",
        "ui": Array [
          "/plugins/RendererPreview/index.tsx",
        ],
      },
      Object {
        "name": "Renderer select",
        "ui": Array [
          "/plugins/RendererSelect/index.tsx",
        ],
      },
      Object {
        "name": "Responsive preview",
        "ui": Array [
          "/plugins/ResponsivePreview/index.tsx",
        ],
      },
      Object {
        "name": "Root",
        "ui": Array [
          "/plugins/Root/index.tsx",
        ],
      },
      Object {
        "name": "Router",
        "ui": Array [
          "/plugins/Router/index.ts",
        ],
      },
      Object {
        "name": "Select control",
        "ui": Array [
          "/plugins/SelectControl/index.tsx",
        ],
      },
      Object {
        "name": "Standard control",
        "ui": Array [
          "/plugins/StandardControl/index.tsx",
        ],
      },
      Object {
        "name": "Storage",
        "ui": Array [
          "/plugins/Storage/index.ts",
        ],
      },
      Object {
        "name": "Webpack HMR notification",
        "ui": Array [
          "/plugins/WebpackHmrNotification/index.ts",
        ],
      },
    ]
  `);
});
