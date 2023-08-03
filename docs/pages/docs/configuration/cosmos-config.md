# `cosmos.config.json`

The Cosmos config is a **JSON** file, so it can only contain serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the Cosmos UI, and enable visual config editing.

## Config Schema

**The best way to learn about the available options in the Cosmos config is to use [config.schema.json](https://github.com/react-cosmos/react-cosmos/blob/main/packages/react-cosmos/config.schema.json).**

The schema is human readable, but you can also enhance your config with autocomplete in code editors like VS Code.

```jsonc
{
  "$schema": "http://json.schemastore.org/cosmos-config"
  // your options...
}
```

And if you use VS Code you can map the Cosmos config schema globally by [extending your user settings](https://code.visualstudio.com/docs/languages/json#_mapping-in-the-user-settings).

```json
"json.schemas": [
  {
    "fileMatch": ["cosmos.config.json"],
    "url": "http://json.schemastore.org/cosmos-config"
  }
]
```

Alternatively, you can reference the local Cosmos config schema in your workspace configuration.

```json
"json.schemas": [
  {
    "fileMatch": ["cosmos.config.json"],
    "url": "./node_modules/react-cosmos/config.schema.json"
  }
]
```

## Custom Viewports

`responsivePreview` is a plugin included by default and you can customize it through the Cosmos config:

```json
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
