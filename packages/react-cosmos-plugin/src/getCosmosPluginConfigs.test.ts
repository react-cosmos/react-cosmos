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
      },
      Object {
        "name": "Class state panel",
        "rootDir": "ClassStatePanel",
      },
      Object {
        "name": "Content overlay",
        "rootDir": "ContentOverlay",
      },
      Object {
        "name": "Control panel",
        "rootDir": "ControlPanel",
      },
      Object {
        "name": "Core",
        "rootDir": "Core",
      },
      Object {
        "name": "Edit fixture button",
        "rootDir": "EditFixtureButton",
      },
      Object {
        "name": "Fixture bookmark",
        "rootDir": "FixtureBookmark",
      },
      Object {
        "name": "Fixture search",
        "rootDir": "FixtureSearch",
      },
      Object {
        "name": "Fixture tree",
        "rootDir": "FixtureTree",
      },
      Object {
        "name": "Full screen button",
        "rootDir": "FullScreenButton",
      },
      Object {
        "name": "Message handler",
        "rootDir": "MessageHandler",
      },
      Object {
        "name": "Notifications",
        "rootDir": "Notifications",
      },
      Object {
        "name": "Plugin list",
        "rootDir": "PluginList",
      },
      Object {
        "name": "Props panel",
        "rootDir": "PropsPanel",
      },
      Object {
        "name": "Remote renderer",
        "rootDir": "RemoteRenderer",
      },
      Object {
        "name": "Renderer core",
        "rootDir": "RendererCore",
      },
      Object {
        "name": "Renderer preview",
        "rootDir": "RendererPreview",
      },
      Object {
        "name": "Renderer select",
        "rootDir": "RendererSelect",
      },
      Object {
        "name": "Responsive preview",
        "rootDir": "ResponsivePreview",
      },
      Object {
        "name": "Root",
        "rootDir": "Root",
      },
      Object {
        "name": "Router",
        "rootDir": "Router",
      },
      Object {
        "name": "Select control",
        "rootDir": "SelectControl",
      },
      Object {
        "name": "Standard control",
        "rootDir": "StandardControl",
      },
      Object {
        "name": "Storage",
        "rootDir": "Storage",
      },
      Object {
        "name": "Webpack HMR notification",
        "rootDir": "WebpackHmrNotification",
      },
    ]
  `);
});
