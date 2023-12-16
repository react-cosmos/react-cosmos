# Plugin Settings

The [Cosmos config](cosmos-config.md) can be extended with plugin settings. For example the Vite plugin reads settings from the `vite` config key, and the Webpack plugin from the `webpack` config key.

## UI Plugin Configuration

Settings under `ui.{pluginName}` keys are passed as configs to [UI plugins](/docs/plugins/ui-plugins.md). Example below.

### Initial Fixture

`router` is a core plugin. You can configure it to automatically open a fixture when opening the Cosmos UI.

```json filename="cosmos.config.json"
{
  "ui": {
    "router": {
      "initialFixtureId": {
        "path": "src/components/TodoApp.fixture.tsx"
      }
    }
  }
}
```

> A fixture ID is a combination of a fixture path and an optional fixture name. A [Multi-Fixture](/docs/fixtures/fixture-modules#multi-fixtures) fixture ID would look like this: `{ "path": "Button.fixture.jsx", name: "Primary Disabled" }`.

### Custom Viewports

`responsivePreview` is a plugin included by default. You customize the device list through the Cosmos config:

```json filename="cosmos.config.json"
{
  "ui": {
    "responsivePreview": {
      "devices": [
        { "label": "iPhone SE", "width": 375, "height": 667 },
        { "label": "iPad mini", "width": 744, "height": 1133 },
        { "label": "1080p", "width": 1920, "height": 1080 }
      ]
    }
  }
}
```
