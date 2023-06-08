# Configuration

## CLI

- The `cosmos` command starts the dev server.
- The `cosmos-native` command starts the dev server for a React Native project.
- The `cosmos-export` command generates a static export.

Some things can be customized using CLI arguments:

| Argument           | Description                                                                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--config`         | Specify a custom config path. By default Cosmos reads `cosmos.config.json` from your root directory.                                                                                                      |
| `--root-dir`       | Specify a root directory for your project. By default the root directory is the parent directory of your Cosmos config or the current working directory in the absence of a Cosmos config.                |
| `--lazy`           | Dynamically import user modules. By default all fixture and decorator modules are imported statically and bundled together.                                                                               |
| `--expose-imports` | Expose user imports and config required for the Cosmos renderer. Use with React Native and in custom integrations. When a path is specified it requires a file extension (eg. `"src/cosmos.imports.ts"`). |
| `--port`           | Convenient way to override the Cosmos dev server port.                                                                                                                                                    |

There rest of the things are customized using the large number of options in the Cosmos config.

## `cosmos.config.json`

The Cosmos config is a **JSON** file, so it can only contain serializable values. This design decision is meant to discourage complex configuration, make it easy to embed config options into the Cosmos UI, and enable visual config editing.

### Config Schema

**The best way to learn about the available options in the Cosmos config is to use [config.schema.json](../../packages/react-cosmos/config.schema.json).**

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

### Custom Viewports

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

## Lazy Mode

In lazy mode, Cosmos dynamically imports fixture and decorator modules only when they are needed, specifically when a fixture is selected in the Cosmos UI. This approach results in code splitting and enhances the isolation of the selected fixture. In this mode, fixture names of [Multi-Fixtures](fixtures.md#multi-fixtures) are revealed upon selection.

To enable lazy mode:

- Set the `lazy` option to `true` in the Cosmos config.
- Use the `--lazy` CLI argument when running a Cosmos command.

Lazy mode is disabled by default.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
