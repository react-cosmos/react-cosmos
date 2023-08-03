# Plugin Settings

The Cosmos config can be extended with plugin settings. For example the Vite plugin reads settings from the `vite` config key. Additionally, settings under `ui.{pluginName}` keys are passed as configs to [UI plugins](/docs/plugins/ui-plugins.md).

## Custom Viewports

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
